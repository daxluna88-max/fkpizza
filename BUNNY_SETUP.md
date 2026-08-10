# Bunny.net Stream — Setup

I video dei piatti (upload da file) ora vengono caricati su **Bunny.net Stream**
invece che su Cloudinary. Le immagini restano su Cloudinary, invariato.

L'upload passa da una Edge Function Supabase (`bunny-video-upload`) perché la
API key di Bunny Stream è un segreto e non può mai essere esposta nel
frontend (a differenza di Cloudinary, che usa un upload preset "unsigned").

## 1. Crea la Video Library su Bunny.net

1. Vai su https://dash.bunny.net/stream e crea una nuova **Video Library**.
2. Annota il **Library ID** (numero, visibile nell'URL della library o nelle
   sue impostazioni).
3. (Opzionale, per URL di riproduzione diretti in .mp4 invece dell'embed
   iframe) attiva la **MP4 Fallback** nella library e annota l'hostname
   della Pull Zone collegata (es. `vz-xxxxx.b-cdn.net`).

Non serve cercare la API Key specifica della library: la funzione la
recupera da sola tramite l'Account API Key (punto 2), chiamando
`GET https://api.bunny.net/videolibrary/{id}`.

## 2. Configura i secret sulla Edge Function Supabase

Le variabili vanno impostate come **secret del progetto Supabase** (non nel
`.env` del sito, che è statico e non ha un server). `BUNNY_API_KEY` è la
**Account API Key** di bunny.net (Account → API, "questa è la chiave che
puoi usare per aggiornare programmaticamente le tue zone o le impostazioni
dell'account"):

```bash
supabase secrets set \
  BUNNY_STREAM_LIBRARY_ID=xxxxx \
  BUNNY_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxx \
  BUNNY_STREAM_PULL_ZONE=vz-xxxxx.b-cdn.net \
  --project-ref llungqolufzcfaqghydt
```

`BUNNY_STREAM_PULL_ZONE` è opzionale: se omesso, la funzione restituisce
l'URL embed `https://iframe.mediadelivery.net/embed/{library}/{video}`.

## 3. Deploy della funzione

```bash
supabase functions deploy bunny-video-upload --project-ref llungqolufzcfaqghydt
```

## 4. Come funziona

- Codice: `supabase/functions/bunny-video-upload/index.ts`
- Client: `bunnyUploadVideo(file)` in `index.html` (usata nei form di
  modifica/creazione piatto, campo "Carica video")
- Flusso: il client invia il file grezzo alla Edge Function con il proprio
  JWT admin → la funzione verifica che l'utente sia un admin registrato →
  recupera la API key della library con l'Account API Key → crea il video
  su Bunny Stream → carica il file → restituisce l'URL da salvare in
  `dishes.video_url`.
- Il link "video" mostrato nel menu del piatto resta un semplice link che
  apre il player Bunny (o il file mp4) in una nuova scheda, come già
  avveniva con Cloudinary.

Il campo "oppure link video (YouTube, Instagram, ecc.)" non è toccato: resta
un semplice URL manuale, non passa da Bunny.
