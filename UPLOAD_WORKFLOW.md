# Workflow Upload 200+ Immagini - Procedura Completa

## Overview

- **200+ immagini** organizzate per 10 ristoranti
- **Zero rischio sovrascrizioni** con sistema di cartelle intelligente
- **Piano Free Cloudinary** è sufficiente (400-600 MB vs 25 GB disponibili)
- **Tempo stimato**: ~2-3 ore di operazioni, completamente autonomo

## Prerequisiti

✓ Login Dashboard con role **superadmin**
✓ Tutte le immagini preparate (PNG/JPG)
✓ Cloudinary account collegato (PRESET: fkpizza_unsigned)

## Struttura File Preparazione

Prima di caricare, organizza le immagini localmente così:

```
immagini/
├── ristorante_1/
│   ├── logo.jpg (quadrato, min 300x300)
│   ├── hero.jpg (16:9, min 1200x600)
│   ├── background.jpg (opzionale)
│   └── piatti/
│       ├── piatto_1.jpg
│       ├── piatto_2.jpg
│       └── ...
├── ristorante_2/
│   ├── logo.jpg
│   ├── hero.jpg
│   └── piatti/
│       └── ...
└── ... (altri 8 ristoranti)
```

## Procedura Upload (5 Step)

### Step 1: Carica Logo e Hero per ogni Ristorante

**Dove**: Dashboard → Ristoranti → [clicca ristorante] → Modifica

**Per ogni ristorante**:

1. Clicca il pulsante **Modifica** accanto al nome
2. Sezione "Logo" → Clicca il campo file → Seleziona `logo.jpg`
3. Clicca "✂ Adatta" per crop automatico a quadrato
4. Sezione "Hero" → Seleziona `hero.jpg`
5. Clicca "✂ Adatta" per crop automatico (16:9)
6. Sezione "Background" (opzionale) → Seleziona `background.jpg`
7. Scorri in basso → Clicca **Salva**

**Tempo**: ~2 minuti per ristorante × 10 = **20 minuti totali**

**File salvati in Cloudinary**:
- `fkpizza/restaurants/[slug]/logo`
- `fkpizza/restaurants/[slug]/hero`
- `fkpizza/restaurants/[slug]/bgimage`

✓ **Zero rischio**: Ogni ristorante ha cartella separata

---

### Step 2: Carica Immagini Piatti - BATCH (Metodo Veloce)

**IMPORTANTE**: Questo è il metodo consigliato per caricare velocemente 150+ piatti

**Dove**: Dashboard → Foto / Media → Carica foto

**Procedura**:

1. Crea una cartella temporanea con TUTTI i piatti (da tutti i ristoranti)
   - Rinomina i file come: `ristorante_nom_piatto.jpg`
   - Esempio: `pizzeria_napoli_margherita.jpg`, `steakhouse_roma_ribeye.jpg`

2. Vai su Dashboard → **Foto / Media**

3. Clicca "Carica foto (selezione multipla)"

4. **Seleziona TUTTE le immagini dei piatti** (possono essere 50-200 file)
   - Lo script supporta upload multiplo

5. Clicca **Carica su Cloudinary**

6. Attendi il completamento (mostra "Caricate X foto")

7. Le foto appariranno nella galleria

**File salvati in Cloudinary**:
- `fkpizza/media/[timestamp]_0`
- `fkpizza/media/[timestamp]_1`
- `fkpizza/media/[timestamp]_2`
- ... (automaticamente numerati)

✓ **Veloce**: 100 foto in ~30 secondi
✓ **Unici**: Timestamp + index = zero conflitti

---

### Step 3: Assegna Immagini ai Piatti

**Dove**: Dashboard → Catalogo Piatti

**Procedura**:

1. Vai su **Catalogo Piatti**

2. Per ogni piatto:
   - Clicca il piatto per visualizzarlo
   - Sezione "Foto" → Clicca il campo file
   - **Seleziona l'immagine dalla media gallery** caricata nel Step 2
   - Sistema salva automaticamente

**Opzione alternativa** (più veloce per pochi piatti):
- Clicca "Modifica" accanto a ogni piatto
- Upload diretto della foto
- Clicca "✂ Adatta" per crop automatico

**File salvati in Cloudinary**:
- `fkpizza/dishes/[dish_id]` (nome univoco per piatto)

---

### Step 4: (Opzionale) Upload Foto Ristorante per Carousel

**Dove**: Dashboard → Foto / Media → Carica foto

Se ogni ristorante ha foto aggiuntive per il carousel (Instagram-style):

1. Raccogli foto di ogni ristorante in cartelle separate
2. Carica separatamente per ristorante (per organizzazione)
   - Questo non è obbligatorio, ma aiuta nella gestione

**File salvati in Cloudinary**:
- `fkpizza/media/[timestamp]_[index]`

---

### Step 5: Verifica e Cleanup

**Checklist finale**:

- [ ] Tutti i 10 ristoranti hanno logo visibile
- [ ] Tutti i 10 ristoranti hanno hero image visibile
- [ ] Almeno 80% dei piatti ha immagine assegnata
- [ ] Nessun errore di caricamento nei log

**Accedi a Cloudinary Console** per verificare:
- https://console.cloudinary.com/console/dajqdbpms/media_library

**Cleanup (opzionale)**:
- Rimuovi immagini vecchie se presenti in `fkpizza/` (non in sottocartelle)
- Non toccare `fkpizza/restaurants/`, `fkpizza/dishes/`, `fkpizza/media/`

---

## Calcolo Storage

```
Scenario: 200 immagini per FK Pizza & More

Asset breakdown:
- Logo per ristorante:           10 × 1 MB = 10 MB
- Hero per ristorante:          10 × 3 MB = 30 MB
- Background per ristorante:    10 × 2 MB = 20 MB
- Piatti (400x400 originale):  150 × 2 MB = 300 MB
- Foto gallery/carousel:         20 × 3 MB = 60 MB
                                          --------
                        TOTALE:                420 MB

Cloudinary Free Tier:
- Storage disponibile:                     25 GB
- Utilizzo:                               420 MB
- Percentuale:                           ~1.7% ✓

Conclusione: AMPIAMENTE SUFFICIENTE
```

---

## Ottimizzazioni Automatiche

Il codice applica automaticamente:

1. **Compression**: `q_auto` (qualità ottimale per formato)
2. **Format**: `f_webp` (50% più piccolo di JPG)
3. **Responsiveness**: `w_` e `h_` per device diversi
4. **CDN**: Cloudinary CDN cache globale

**Risultato**: Velocità di caricamento ottimale, storage minimo

---

## Troubleshooting

### "Caricamento non riuscito"
- Verifica che la foto non superi 20 MB
- Controlla la connessione internet
- Riprova il caricamento

### "Foto non compare dopo salvataggio"
- Attendi 5-10 secondi per il refresh di Cloudinary
- Ricarica la pagina (Cmd+R / Ctrl+R)
- Verifica il filtro della galleria

### "Tutte le foto hanno lo stesso nome in Cloudinary"
- ✓ **Non è un problema!** Sistema usa ID univoco automaticamente
- Ogni foto ha nome diverso in Cloudinary database

### "Voglio eliminare una foto"
1. Accedi Cloudinary Console
2. Media Library → cerca per nome file
3. Clicca delete

**Nota**: Non elimina il riferimento dai piatti - aggiorna manualmente il piatto se necessario

---

## Dati di Riferimento

**Cloudinary Account**:
- Cloud Name: `dajqdbpms`
- Upload Preset: `fkpizza_unsigned`
- Dashboard: https://console.cloudinary.com/console/dajqdbpms

**Cartelle Cloudinary**:
- Ristoranti: `fkpizza/restaurants/`
- Piatti: `fkpizza/dishes/`
- Media: `fkpizza/media/`
- Edits: `fkpizza/edits/`

---

## Timeline Realistica

| Fase | Azione | Tempo |
|------|--------|-------|
| Preparazione | Raccogliere e rinominare file | 30 min |
| Step 1 | Upload logo/hero (10 ristoranti) | 20 min |
| Step 2 | Upload batch 150 piatti | 5 min |
| Step 3 | Assegna piatti a database | 30 min |
| Step 4 | Photo carousel (opzionale) | 15 min |
| Step 5 | Verifica e cleanup | 10 min |
| **TOTALE** | | **1.5-2 ore** |

Puoi distribuire il lavoro su più giorni se preferisci.

---

## Prossimi Passi

Una volta uploaded tutte le immagini:

1. **Test sui dispositivi reali**
   - Apri ristorante dal telefono
   - Verifica caricamento immagini

2. **Monitorare bandwidth**
   - Cloudinary mostra statistiche in dashboard
   - Se superiore al limite free, upgrade o ottimizzazione

3. **Backup**
   - Salva una copia locale importante immagini
   - Cloudinary è affidabile, ma è sempre bene avere backup

---

## Supporto

Domande durante l'upload?
1. Controlla console browser (F12 → Console tab)
2. Accedi Cloudinary per verificare file

Problema critico? Scrivi l'errore esatto dal browser.
