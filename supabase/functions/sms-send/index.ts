import { createClient } from 'jsr:@supabase/supabase-js@2';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });
}

function genCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

// Chiamata isolata a BulkGate: se il formato esatto della loro API differisce da questo
// (Simple Transactional SMS v2.0 standard), va corretto solo qui.
async function sendBulkGateSms(number: string, text: string) {
  const appId = Deno.env.get('BULKGATE_APPLICATION_ID');
  const appToken = Deno.env.get('BULKGATE_APPLICATION_TOKEN');
  if (!appId || !appToken) throw new Error('BulkGate non configurato (secrets mancanti)');
  const res = await fetch('https://portal.bulkgate.com/api/2.0/simple/transactional', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      application_id: appId,
      application_token: appToken,
      number: number.replace('+', ''),
      text,
    }),
  });
  const rawText = await res.text();
  let data: any = {};
  try { data = JSON.parse(rawText); } catch { /* risposta non JSON, resta in rawText */ }
  if (!res.ok || (data && data.error)) {
    console.error('BulkGate response:', res.status, rawText);
    throw new Error((data && data.error && (data.error.message || data.error)) || ('BulkGate HTTP ' + res.status + ': ' + rawText.slice(0, 200)));
  }
  return data;
}

const DEFAULT_TABLE_RETURN_MESSAGE = 'Grazie per la visita da {nome}! Raccontaci com\'è andata e scopri una sorpresa per te: {link}';

function fillTemplate(template: string, vars: Record<string, string>) {
  let out = template;
  for (const k of Object.keys(vars)) out = out.split('{' + k + '}').join(vars[k]);
  if (!template.includes('{link}') && vars.link) out = out + ' ' + vars.link;
  return out;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json(405, { error: 'method' });

  let body: any;
  try { body = await req.json(); } catch { return json(400, { error: 'json non valido' }); }
  const { type, restaurant_id, phone, order_id } = body || {};
  if (!restaurant_id || !phone) return json(400, { error: 'parametri mancanti' });

  const url = Deno.env.get('SUPABASE_URL');
  const svc = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const admin = createClient(url as string, svc as string, { auth: { persistSession: false } });

  if (type === 'otp') {
    const { data: recent } = await admin.from('phone_verifications')
      .select('id, created_at')
      .eq('restaurant_id', restaurant_id).eq('phone', phone)
      .order('created_at', { ascending: false }).limit(1).maybeSingle();
    if (recent && (Date.now() - new Date(recent.created_at as string).getTime()) < 60000) {
      return json(429, { error: 'Attendi qualche secondo prima di richiedere un nuovo codice.' });
    }

    const code = genCode();
    const expires = new Date(Date.now() + 10 * 60000).toISOString();
    const { error: insErr } = await admin.from('phone_verifications').insert({
      restaurant_id, phone, code, expires_at: expires,
    });
    if (insErr) return json(500, { error: 'Errore interno' });

    try {
      await sendBulkGateSms(phone, `Il tuo codice di verifica è: ${code}`);
    } catch (e) {
      console.error('sms-send otp error:', e);
      return json(502, { error: (e && e.message) || 'Invio SMS non riuscito' });
    }
    await admin.from('sms_log').insert({ restaurant_id, type: 'otp' }).then(() => {}, () => {});
    return json(200, { ok: true });
  }

  if (type === 'order_link') {
    const { data: order } = await admin.from('orders').select('id, restaurant_id').eq('id', order_id).maybeSingle();
    if (!order) return json(404, { error: 'ordine non trovato' });
    const { data: rest } = await admin.from('restaurants').select('name').eq('id', order.restaurant_id as string).maybeSingle();
    const host = Deno.env.get('PUBLIC_SITE_URL') || 'https://fkpizza.vercel.app';
    const link = `${host}/?order=${order.id}`;
    try {
      await sendBulkGateSms(phone, `Grazie per il tuo ordine da ${(rest && rest.name) || 'FK Pizza'}! Riepilogo: ${link}`);
    } catch (e) {
      console.error('sms-send order_link error:', e);
      return json(502, { error: (e && e.message) || 'Invio SMS non riuscito' });
    }
    await admin.from('sms_log').insert({ restaurant_id: order.restaurant_id, type: 'order_link' }).then(() => {}, () => {});
    return json(200, { ok: true });
  }

  if (type === 'table_return') {
    const { data: order } = await admin.from('orders').select('id, restaurant_id').eq('id', order_id).maybeSingle();
    if (!order) return json(404, { error: 'ordine non trovato' });
    const { data: rest } = await admin.from('restaurants').select('name').eq('id', order.restaurant_id as string).maybeSingle();
    const { data: settings } = await admin.from('sms_verification_settings').select('table_delay_message').eq('restaurant_id', order.restaurant_id as string).maybeSingle();
    const host = Deno.env.get('PUBLIC_SITE_URL') || 'https://fkpizza.vercel.app';
    const link = `${host}/?order=${order.id}`;
    const template = (settings && settings.table_delay_message) || DEFAULT_TABLE_RETURN_MESSAGE;
    const text = fillTemplate(template, { nome: (rest && rest.name) || 'FK Pizza', link });
    try {
      await sendBulkGateSms(phone, text);
    } catch (e) {
      console.error('sms-send table_return error:', e);
      return json(502, { error: (e && e.message) || 'Invio SMS non riuscito' });
    }
    await admin.from('sms_log').insert({ restaurant_id: order.restaurant_id, type: 'table_return' }).then(() => {}, () => {});
    return json(200, { ok: true });
  }

  return json(400, { error: 'type non valido' });
});
