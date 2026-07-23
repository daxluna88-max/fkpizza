# Checklist Organizzazione Cloudinary - 200+ Immagini

## Pre-Upload Checklist

### Preparazione Immagini
- [ ] Raccolte tutte le immagini in cartelle locali
- [ ] Logos rinominati: `logo.jpg` (qualità: min 300x300)
- [ ] Hero images rinominati: `hero.jpg` (qualità: 16:9, min 1200x600)
- [ ] Piatti rinominati con nome descrittivo: `piatto_margherita.jpg`
- [ ] Foto extra: in cartella separata per gallery
- [ ] Nessun file sopra 20 MB (troppo pesante)
- [ ] Formato: JPG o PNG (no BMP, TIFF)

### Setup Cloudinary
- [ ] Account Cloudinary attivo: https://cloudinary.com
- [ ] Cloud Name verificato: `dajqdbpms`
- [ ] Upload Preset creato: `fkpizza_unsigned` (unsigned upload)
- [ ] Accesso Dashboard: https://console.cloudinary.com/console/dajqdbpms

### Dashboard FK Pizza
- [ ] Accesso superadmin verificato
- [ ] Tutti i 10 ristoranti creati nel database
- [ ] Slug corretto per ogni ristorante (minuscolo, senza spazi)

---

## Upload Fase per Fase

### Fase 1: Restaurant Assets (Logo + Hero)

**Target**: 10 ristoranti × (logo + hero) = 20 immagini

| Ristorante | Logo | Hero | Background | Status |
|------------|------|------|------------|--------|
| [ ] | ◻ | ◻ | ◻ | Ristorante 1 |
| [ ] | ◻ | ◻ | ◻ | Ristorante 2 |
| [ ] | ◻ | ◻ | ◻ | Ristorante 3 |
| [ ] | ◻ | ◻ | ◻ | Ristorante 4 |
| [ ] | ◻ | ◻ | ◻ | Ristorante 5 |
| [ ] | ◻ | ◻ | ◻ | Ristorante 6 |
| [ ] | ◻ | ◻ | ◻ | Ristorante 7 |
| [ ] | ◻ | ◻ | ◻ | Ristorante 8 |
| [ ] | ◻ | ◻ | ◻ | Ristorante 9 |
| [ ] | ◻ | ◻ | ◻ | Ristorante 10 |

**Procedi**: Dashboard → Ristoranti → [Ristorante] → Modifica → Upload Logo → Upload Hero → Salva

**Cartella Cloudinary**: `fkpizza/restaurants/[slug]/`

**Tempo**: 2 min/ristorante × 10 = 20 min

---

### Fase 2: Dish Images - BATCH Upload

**Target**: 150-200 immagini piatti in una volta

#### Pre-Upload
- [ ] Piatti organizzati in cartella unica
- [ ] Nomi descrittivi (es: `margherita.jpg`, `lasagna.jpg`)
- [ ] File count: _____ (numero totale piatti)

#### Upload
1. Dashboard → **Foto / Media**
2. "Carica foto (selezione multipla)" → Seleziona TUTTI i file di piatti
3. Clicca **Carica su Cloudinary**
4. Attendi completamento

#### Verifica
- [ ] Messaggio "✓ Caricate X foto"
- [ ] Foto visibili nella galleria sotto
- [ ] Nessun errore rosso

**Cartella Cloudinary**: `fkpizza/media/[timestamp]_[index]/`

**Tempo**: 30 sec/100 foto

---

### Fase 3: Assegna Piatti al Database

**Target**: Collegare le foto caricate ai record piatti

#### Per ogni piatto:
- [ ] Apri Catalogo Piatti
- [ ] Trova piatto privo di immagine
- [ ] Modifica → "Foto" → Seleziona dalla media gallery
- [ ] Conferma
- [ ] Ripeti per tutti

**Cartella Cloudinary**: `fkpizza/dishes/[dish_id]/`

**Tempo**: 15 sec/piatto × 150 = ~40 min

**Opzione alternativa** (più lenta ma più precisa):
- Upload diretto durante modifica piatto
- Una foto per volta

---

### Fase 4: Extra Assets (Opzionale)

**Target**: Foto aggiuntive per gallery/carousel

- [ ] Foto Instagram/ambiance raccolte
- [ ] Foto ingredienti premium
- [ ] Foto team/chef
- [ ] Numero foto extra: _____

**Upload** (stesso metodo Fase 2):
1. Dashboard → Foto / Media
2. Carica tutte le foto extra
3. Assegna ai piatti di "supporto" se necessario

**Cartella Cloudinary**: `fkpizza/media/`

---

## Post-Upload Verification

### Verifica Database
- [ ] Accedi admin → ogni ristorante mostra logo
- [ ] Accedi admin → ogni ristorante mostra hero image
- [ ] Accedi admin → catalogo piatti mostra % immagini
- [ ] Visita sito pubblico → ristorante mostra logo/hero
- [ ] Visita sito pubblico → piatti mostrano immagini

### Verifica Cloudinary Console
- [ ] Accedi: https://console.cloudinary.com/console/dajqdbpms/media_library
- [ ] Visibili cartelle: `fkpizza/restaurants/`
- [ ] Visibili cartelle: `fkpizza/dishes/`
- [ ] Visibili cartelle: `fkpizza/media/`
- [ ] Storage usage < 1 GB (dovrebbe essere ~500 MB)

### Verifica Performance
- [ ] Immagini si caricano in < 2 sec su mobile
- [ ] Qualità accettabile (non pixelate)
- [ ] Nessun errore 404 nella console browser (F12)

---

## Organizzazione Finale (Cartelle Cloudinary)

```
fkpizza/
├── restaurants/
│   ├── pizzeria-napoli/
│   │   ├── logo (quadrato, Cloudinary URL)
│   │   ├── hero (16:9, Cloudinary URL)
│   │   └── bgimage (opzionale)
│   ├── steakhouse-roma/
│   │   ├── logo
│   │   ├── hero
│   │   └── bgimage
│   └── ... (altri 8)
├── dishes/
│   ├── [id_piatto_1] (foto piatto 1)
│   ├── [id_piatto_2] (foto piatto 2)
│   └── ... (fino a 200)
├── media/
│   ├── [timestamp]_0 (batch upload 1)
│   ├── [timestamp]_1 (batch upload 2)
│   └── ...
└── edits/
    └── [timestamp] (cropped images, temporanei)

Total: ~200 immagini in 4 cartelle logiche
```

---

## Storage Summary

| Elemento | Quantità | Peso/Unit | Totale |
|----------|----------|-----------|--------|
| Logo ristorante | 10 | 1 MB | 10 MB |
| Hero ristorante | 10 | 3 MB | 30 MB |
| Background | 10 | 2 MB | 20 MB |
| Piatti | 150-200 | 2 MB | 300-400 MB |
| Gallery/Extra | 20-30 | 3 MB | 60-90 MB |
| **TOTALE** | **~250** | | **~500 MB** |
| **Free Tier Limit** | | | **25 GB** |
| **Utilizzo %** | | | **~2%** |

✓ **Abbondantemente sufficiente**

---

## Rollback / Cleanup

### Se vuoi ricominciare
1. Accedi Cloudinary Console
2. Media Library → Seleziona cartella `fkpizza`
3. Delete folder (elimina tutto)
4. Ricomincia da capo

### Se vuoi rimuovere singole foto
1. Console Cloudinary → Media Library
2. Cerca per nome file
3. Click → Delete
4. Ripeti per ogni file

### Se vuoi spostare foto tra cartelle
1. Console Cloudinary → Media Library
2. Right-click foto → Move
3. Seleziona destinazione
4. Salva

---

## Timeline Realistica Cronometraggio

Usando i tempi stimati:

```
Fase 1: Restaurant assets        20 min ██░░░░░░░░
Fase 2: Batch upload piatti       5 min █░░░░░░░░░
Fase 3: Assegna piatti          40 min ████████░░
Fase 4: Extra assets (opz)      15 min ███░░░░░░░
Fase 5: Verifica cleanup        10 min ██░░░░░░░░
                                --------
           TOTALE              90 min (1.5 ore)

Distribuzione suggerita:
- Lunedì: Fase 1 (20 min)
- Martedì: Fase 2 + 3 (45 min)
- Mercoledì: Fase 4 + 5 (25 min)
```

Oppure in unica sessione: ~90 min non-stop

---

## Domande Frequenti

**D: Posso caricare piatti mentre sono in upload hero?**
✓ Sì, Cloudinary processare upload in parallelo

**D: Se sbaglio a caricare una foto come la cambio?**
✓ Modifica il piatto → Foto → Seleziona quella giusta → Salva

**D: Le foto si vedono subito o c'è ritardo?**
~ Cloudinary impiega 5-10 sec per processare, poi è immediato

**D: Posso cancellare le vecchie immagini in fkpizza/?**
✓ Sì, ma verifica prima che non siano usate

**D: Il piano free ha limite mensile?**
✓ No, i 25 GB sono mensili permanenti, non in scadenza

---

## Contatti Supporto

**Se hai problemi**:
1. Controlla la sezione Troubleshooting in UPLOAD_WORKFLOW.md
2. Verifica console browser (F12 → Console)
3. Accedi Cloudinary dashboard per verificare lo stato

**Se il problema persiste**:
- Cloudinary status: https://status.cloudinary.com
- Scrivere l'errore esatto (screenshot Console browser)

---

**Status**: ☐ Non iniziato | ◐ In corso | ☑ Completato

Data inizio: ______  
Data completamento: ______
