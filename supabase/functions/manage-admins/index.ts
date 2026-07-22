import { createClient } from 'jsr:@supabase/supabase-js@2';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
function json(status, body) {
  return new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });
}
const ROLES = ['superadmin', 'admin', 'collaboratore'];
function normRole(r) { return ROLES.includes(r) ? r : 'admin'; }
function normPerms(p) {
  const keys = ['restaurants', 'dishes', 'media', 'orders', 'account'];
  const out = {};
  keys.forEach((k) => { out[k] = !!(p && p[k]); });
  return out;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json(405, { error: 'method' });

  const url = Deno.env.get('SUPABASE_URL');
  const svc = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const admin = createClient(url, svc, { auth: { persistSession: false } });

  const authHeader = req.headers.get('Authorization') || '';
  const jwt = authHeader.replace('Bearer ', '').trim();
  if (!jwt) return json(401, { error: 'no token' });

  const { data: ures, error: uerr } = await admin.auth.getUser(jwt);
  if (uerr || !ures || !ures.user) return json(401, { error: 'invalid token' });
  const { data: me } = await admin.from('admins').select('role').eq('auth_user_id', ures.user.id).maybeSingle();
  if (!me || !['superadmin', 'super_admin'].includes(me.role)) return json(403, { error: 'forbidden' });

  let body;
  try { body = await req.json(); } catch (_e) { return json(400, { error: 'bad json' }); }
  const action = body.action;

  if (action === 'create') {
    if (!body.email || !body.password) return json(400, { error: 'email e password obbligatorie' });
    const { data: created, error } = await admin.auth.admin.createUser({
      email: String(body.email).trim().toLowerCase(),
      password: String(body.password),
      email_confirm: true,
    });
    if (error || !created || !created.user) return json(400, { error: (error && error.message) || 'creazione fallita' });
    const { error: ierr } = await admin.from('admins').insert({
      auth_user_id: created.user.id,
      email: created.user.email,
      name: body.name || created.user.email,
      role: normRole(body.role),
      restaurants_assigned: Array.isArray(body.restaurants) ? body.restaurants : [],
      permissions: normPerms(body.permissions),
    });
    if (ierr) { await admin.auth.admin.deleteUser(created.user.id); return json(400, { error: ierr.message }); }
    return json(200, { ok: true, id: created.user.id });
  }

  if (action === 'update') {
    if (!body.id) return json(400, { error: 'id mancante' });
    const patch = {};
    if (body.name != null) patch.name = String(body.name);
    if (body.role != null) patch.role = normRole(body.role);
    if (body.restaurants != null) patch.restaurants_assigned = Array.isArray(body.restaurants) ? body.restaurants : [];
    if (body.permissions != null) patch.permissions = normPerms(body.permissions);
    if (!Object.keys(patch).length) return json(400, { error: 'nessun campo da aggiornare' });
    const { error } = await admin.from('admins').update(patch).eq('id', body.id);
    if (error) return json(400, { error: error.message });
    return json(200, { ok: true });
  }

  if (action === 'set_password') {
    if (!body.auth_user_id || !body.password) return json(400, { error: 'dati mancanti' });
    const { error } = await admin.auth.admin.updateUserById(body.auth_user_id, { password: String(body.password) });
    if (error) return json(400, { error: error.message });
    return json(200, { ok: true });
  }

  if (action === 'delete') {
    if (!body.id) return json(400, { error: 'id mancante' });
    if (body.auth_user_id === ures.user.id) return json(400, { error: 'non puoi eliminare te stesso' });
    await admin.from('admins').delete().eq('id', body.id);
    if (body.auth_user_id) await admin.auth.admin.deleteUser(body.auth_user_id);
    return json(200, { ok: true });
  }

  return json(400, { error: 'azione non valida' });
});
