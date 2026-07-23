# Guida Organizzazione Immagini Cloudinary

## Struttura Cartelle Ottimale

```
fkpizza/
├── restaurants/
│   ├── [restaurant_slug]/
│   │   ├── logo
│   │   ├── hero
│   │   ├── bgimage
│   │   └── dishes/
│   │       ├── [dish_id]_1
│   │       ├── [dish_id]_2
│   │       └── ...
│   ├── pizzeria-napoli/
│   ├── steakhouse-roma/
│   └── ...
├── media/
│   ├── [ristorante_slug]_photo_1
│   ├── [ristorante_slug]_photo_2
│   └── ...
└── shared/
    └── logo_fk (brand logo comune)
```

## Naming Convention

Per evitare sovrascrizioni, ogni ristorante ha il suo namespace:

### Restaurant Assets (Logo, Hero, Background)
- **Path**: `fkpizza/restaurants/[restaurant_slug]/[type]`
- **Esempi**:
  - `fkpizza/restaurants/pizzeria-napoli/logo`
  - `fkpizza/restaurants/steakhouse-roma/hero`
  - `fkpizza/restaurants/trattoria-milano/bgimage`

### Dish Images
- **Path**: `fkpizza/restaurants/[restaurant_slug]/dishes/[dish_id]_[numero]`
- **Esempi**:
  - `fkpizza/restaurants/pizzeria-napoli/dishes/d123_1`
  - `fkpizza/restaurants/pizzeria-napoli/dishes/d456_2`

### Media Gallery
- **Path**: `fkpizza/media/[restaurant_slug]_[timestamp]_[numero]`
- **Esempi**:
  - `fkpizza/media/pizzeria-napoli_1726000000_1`
  - `fkpizza/media/steakhouse-roma_1726000000_1`

## Piano Free Cloudinary - Limiti e Utilizzo

### Risorse Disponibili
- **Storage**: 25 GB (sufficiente per ~200 immagini con transform)
- **Monthly transformations**: 25 GB
- **API calls**: 300,000/mese
- **Upload**: Illimitati (numero di file)

### Calcolo per 200 immagini
- **200 immagini** × ~2-3 MB (medie) = **400-600 MB** storage
- **Molto al di sotto** del limite di 25 GB ✓

### Ottimizzazioni Consigliate

1. **Compressione Immagini**
   - Usare `q_auto` nelle trasformazioni (qualità automatica)
   - Usare `f_webp` per formato efficiente
   - Foto ristorante: max 1600px larghezza
   - Dish cards: max 600px larghezza

2. **Caching**
   - Le URL Cloudinary includono il public_id (immutabile)
   - Usare aggressivo caching HTTP per risparmiare bandwidth

3. **Trasformazioni**
   - Lazy loading su carousel e gallery
   - Usare srcset per responsive images
   - Evitare trasformazioni ridondanti

## Implementazione nel Codice

### 1. Update adminEditRest() - Upload con cartella per ristorante

```javascript
// Vecchio:
var logo = await up('e_logo', 'fkpizza/' + (r.slug || r.subdomain || 'rest'));

// Nuovo:
var restSlug = r.slug || r.subdomain || 'rest';
var logo = await up('e_logo', 'fkpizza/restaurants/' + restSlug + '/logo');
var hero = await up('e_hero', 'fkpizza/restaurants/' + restSlug + '/hero');
var bgi = await up('e_bgimg', 'fkpizza/restaurants/' + restSlug + '/bgimage');
```

### 2. Update adminUploadDishImage() - Upload piatti

```javascript
// Vecchio:
var url = await cloudUpload(file, 'fkpizza/dishes');

// Nuovo:
var restSlug = currentRestaurantSlug; // da passare al contesto
var dishId = id; // l'id del piatto
var url = await cloudUpload(file, 'fkpizza/restaurants/' + restSlug + '/dishes/' + dishId);
```

### 3. Update adminMedia() - Upload media gallery

```javascript
// Vecchio:
var url = await cloudUpload(files[i], 'fkpizza/media');

// Nuovo:
var restSlug = currentRestaurantSlug;
var timestamp = Date.now();
var url = await cloudUpload(files[i], 'fkpizza/media/' + restSlug + '_' + timestamp + '_' + i);
```

## Istruzioni di Migrazione

### Se hai già immagini caricate

1. **Accedi a Cloudinary Console**
   - https://console.cloudinary.com/console/dajqdbpms/media_library

2. **Crea cartelle manualmente** (opzionale, ma consigliato)
   - `fkpizza/restaurants/[slug]/logo`
   - `fkpizza/restaurants/[slug]/hero`
   - ecc.

3. **Organizza immagini esistenti**
   - Sposta i file vecchi nelle nuove cartelle
   - O lascia i file vecchi (comunque accessibili) e usa nuova struttura per i nuovi

4. **Update database** (se necessario)
   - Se le vecchie URL non funzionano, update i record di restaurants

### Nuovo Workflow Upload

1. **Logo/Hero/Background**: Sistema salva automaticamente nella cartella giusta
2. **Piatti**: Quando carichihi un piatto, va in `restaurants/[slug]/dishes/`
3. **Media**: Quando carichi da Media Gallery, va in `media/[slug]_[timestamp]_[numero]`

## Benefici della Struttura

✓ **Nessuna sovrascrizione**: Ogni ristorante ha namespace separato
✓ **Facile gestione**: Pulire o duplicare è semplice
✓ **Scalabilità**: Aggiungere nuovi ristoranti non cambia struttura
✓ **Backup**: Facile trovare/esportare immagini per ristorante
✓ **Piano Free sufficiente**: 200 immagini = ~5% del limite 25 GB
✓ **Performance**: CDN Cloudinary cache le URL a vita intera

## Checklist Setup

- [ ] Creare cartelle base su Cloudinary (facoltativo, auto-create con upload)
- [ ] Aggiornare funzione `up()` per usare restaurant slug
- [ ] Aggiornare `adminUploadDishImage()` con path ristorante
- [ ] Aggiornare `adminMedia()` con path ristorante
- [ ] Testare upload logo da admin
- [ ] Testare upload piatto da catalogo
- [ ] Testare media gallery
- [ ] Verificare URL nel database
- [ ] Backup immagini importanti

## Esempio URL Finali

```
https://res.cloudinary.com/dajqdbpms/image/upload/w_200,h_200,c_fill,f_webp,q_auto/fkpizza/restaurants/pizzeria-napoli/logo

https://res.cloudinary.com/dajqdbpms/image/upload/w_600,h_720,c_fill,f_webp,q_auto/fkpizza/restaurants/pizzeria-napoli/dishes/d123_1

https://res.cloudinary.com/dajqdbpms/image/upload/w_800,h_600,c_fill,f_webp,q_auto/fkpizza/media/pizzeria-napoli_1726000000_1
```

## Supporto e Domande

- Cloudinary Free docs: https://cloudinary.com/documentation
- Media Library console: https://console.cloudinary.com/console/dajqdbpms/media_library
