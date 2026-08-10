# Bunny.net Stream — Setup

I video dei piatti (upload da file) ora vengono caricati su **Bunny.net Stream**
invece che su Cloudinary. Le immagini restano su Cloudinary, invariato.

L'upload passa da una Edge Function Supabase (`bunny-video-upload`) perché la
API key di Bunny Stream è un segreto e non può mai essere esposta nel
frontend (a differenza di Cloudinary, che usa un upload preset "unsigned").

## 1. Crea la Video Library su Bunny.net

1. Vai su https://dash.bunny.net/stream e crea una nuova **Video Library**.
2. Annota il **Library ID** (numero) e la **API Key** della library
   (Library → Settings → API → "Video Library API Key").
3. (Opzionale, per URL di riproduzione diretti in .mp4 invece dell'embed
   iframe) attiva la **MP4 Fallback** nella library e annota l'hostname
   della Pull Zone collegata (es. `vz-xxxxx.b-cdn.net`).

## 2. Configura i secret sulla Edge Function Supabase

Le variabili vanno impostate come **secret del progetto Supabase** (non nel
`.env` del sito, che è statico e non ha un server):

```bash
supabase secrets set \
  BUNNY_STREAM_LIBRARY_ID=xxxxx \
  BUNNY_STREAM_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxx \
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
  crea il video su Bunny Stream → carica il file → restituisce l'URL da
  salvare in `dishes.video_url`.
- Il link "video" mostrato nel menu del piatto resta un semplice link che
  apre il player Bunny (o il file mp4) in una nuova scheda, come già
  avveniva con Cloudinary.

Il campo "oppure link video (YouTube, Instagram, ecc.)" non è toccato: resta
un semplice URL manuale, non passa da Bunny.
