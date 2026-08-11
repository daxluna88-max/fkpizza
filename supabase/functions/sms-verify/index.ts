import { createClient } from 'jsr:@supabase/supabase-js@2';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });
}

const MAX_ATTEMPTS = 5;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json(405, { error: 'method' });

  let body: any;
  try { body = await req.json(); } catch { return json(400, { error: 'json non valido' }); }
  const { restaurant_id, phone, code } = body || {};
  if (!restaurant_id || !phone || !code) return json(400, { error: 'parametri mancanti' });

  const url = Deno.env.get('SUPABASE_URL');
  const svc = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const admin = createClient(url as string, svc as string, { auth: { persistSession: false } });

  const { data: row } = await admin.from('phone_verifications')
    .select('*')
    .eq('restaurant_id', restaurant_id).eq('phone', phone)
    .order('created_at', { ascending: false }).limit(1).maybeSingle();

  if (!row) return json(404, { error: 'Nessuna verifica in corso per questo numero.' });

  if (new Date(row.expires_at as string).getTime() < Date.now()) {
    await admin.from('phone_verification_failures').insert({ restaurant_id, phone, reason: 'expired' });
    await admin.from('phone_verifications').delete().eq('id', row.id as string);
    return json(410, { error: 'Codice scaduto, richiedine uno nuovo.' });
  }

  if (String(row.code) !== String(code).trim()) {
    const attempts = ((row.attempts as number) || 0) + 1;
    if (attempts >= MAX_ATTEMPTS) {
      await admin.from('phone_verification_failures').insert({ restaurant_id, phone, reason: 'max_attempts' });
      await admin.from('phone_verifications').delete().eq('id', row.id as string);
      return json(429, { error: 'Troppi tentativi errati. Richiedi un nuovo codice.' });
    }
    await admin.from('phone_verifications').update({ attempts }).eq('id', row.id as string);
    return json(401, { error: 'Codice non corretto.', attempts_left: MAX_ATTEMPTS - attempts });
  }

  await admin.from('phone_verifications').update({ verified: true }).eq('id', row.id as string);
  return json(200, { ok: true });
});
