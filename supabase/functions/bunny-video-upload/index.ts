import { createClient } from 'jsr:@supabase/supabase-js@2';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-file-name',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
function json(status, body) {
  return new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json(405, { error: 'method' });

  const url = Deno.env.get('SUPABASE_URL');
  const svc = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const libraryId = Deno.env.get('BUNNY_STREAM_LIBRARY_ID');
  const accountApiKey = Deno.env.get('BUNNY_API_KEY');
  const pullZone = Deno.env.get('BUNNY_STREAM_PULL_ZONE') || '';
  if (!libraryId || !accountApiKey) return json(500, { error: 'Bunny Stream non configurato' });

  const admin = createClient(url, svc, { auth: { persistSession: false } });

  const authHeader = req.headers.get('Authorization') || '';
  const jwt = authHeader.replace('Bearer ', '').trim();
  if (!jwt) return json(401, { error: 'no token' });
  const { data: ures, error: uerr } = await admin.auth.getUser(jwt);
  if (uerr || !ures || !ures.user) return json(401, { error: 'invalid token' });
  const { data: me } = await admin.from('admins').select('id').eq('auth_user_id', ures.user.id).maybeSingle();
  if (!me) return json(403, { error: 'forbidden' });

  const isJson = (req.headers.get('Content-Type') || '').indexOf('application/json') !== -1;
  let sourceUrl = '';
  let fileName = req.headers.get('X-File-Name') || 'video';
  if (isJson) {
    let body;
    try { body = await req.json(); } catch (_e) { return json(400, { error: 'bad json' }); }
    sourceUrl = String(body.url || '').trim();
    if (!sourceUrl || !/^https?:\/\//i.test(sourceUrl)) return json(400, { error: 'url non valido' });
    fileName = body.title || fileName;
  } else {
    const contentLength = req.headers.get('Content-Length');
    if (!contentLength || Number(contentLength) <= 0) return json(400, { error: 'file mancante' });
  }

  const libRes = await fetch(`https://api.bunny.net/videolibrary/${libraryId}`, {
    headers: { AccessKey: accountApiKey },
  });
  if (!libRes.ok) return json(502, { error: 'lettura video library Bunny fallita' });
  const lib = await libRes.json();
  const streamApiKey = lib && lib.ApiKey;
  if (!streamApiKey) return json(502, { error: 'api key della library non trovata' });

  const createRes = await fetch(`https://video.bunnycdn.com/library/${libraryId}/videos`, {
    method: 'POST',
    headers: { AccessKey: streamApiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: fileName }),
  });
  if (!createRes.ok) return json(502, { error: 'creazione video Bunny fallita' });
  const created = await createRes.json();
  const videoId = created && created.guid;
  if (!videoId) return json(502, { error: 'risposta Bunny non valida' });

  if (isJson) {
    const fetchRes = await fetch(`https://video.bunnycdn.com/library/${libraryId}/videos/${videoId}/fetch`, {
      method: 'POST',
      headers: { AccessKey: streamApiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: sourceUrl }),
    });
    if (!fetchRes.ok) return json(502, { error: 'importazione video da URL fallita' });
  } else {
    const uploadRes = await fetch(`https://video.bunnycdn.com/library/${libraryId}/videos/${videoId}`, {
      method: 'PUT',
      headers: { AccessKey: streamApiKey },
      body: req.body,
    });
    if (!uploadRes.ok) return json(502, { error: 'upload video Bunny fallito' });
  }

  const playUrl = pullZone
    ? `https://${pullZone}/${videoId}/play_720p.mp4`
    : `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}`;

  return json(200, { ok: true, videoId, url: playUrl });
});
