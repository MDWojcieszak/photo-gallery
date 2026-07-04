# Frontend brief — publiczna strona Portfolio

Brief dla frontu, który **wyświetla** publiczne portfolio fotograficzne (strona dla odwiedzających, read-only). Nie dotyczy panelu admina — zarządzanie galeriami opisuje [frontend-brief-gallery-portfolio.md](./frontend-brief-gallery-portfolio.md).

Wszystkie endpointy tutaj są **`@Public()`** (bez tokenu). Publicznie widać **tylko galerie `PUBLISHED`**; `DRAFT/HIDDEN/ARCHIVED` nie istnieją dla świata. W obrębie galerii zdjęcia z rolą `HIDDEN` są odfiltrowane po stronie backendu.

---

## 0. Zasada nadrzędna

**Premium robi front.** Backend podaje: kolejność, rolę, orientację, wymiary, wersje obrazu (cover/low-res), EXIF i lokalizację. **Układ** (masonry, rozmiary kafli, lightbox, animacje, blur-up) składasz sam. Backend celowo **nie** ma page-buildera, tagów, kategorii, croppingu, analityki, SEO-generatora — nie próbuj tego konsumować, bo tego nie ma.

---

## 1. Mapa stron → endpointy

| Strona | Endpoint(y) | Odpowiedź |
|---|---|---|
| **Home — „Selected Work"** (hero) | `GET /portfolio/hero?limit=12` | `PortfolioHeroResponse` |
| **Home — lista galerii** | `GET /portfolio/galleries` | `PortfolioGalleryListResponse` |
| **Galeria (podstrona)** | `GET /portfolio/galleries/:slug?orientation=` | `PortfolioGalleryDetailResponse` |
| **Obrazy** (w każdym kaflu/lightboxie) | `GET /image/cover?id=` · `GET /image/low-res?id=` | strumień `image/webp` |
| **(opcjonalnie) podpis zdjęcia w lightboxie** | `GET /image?id=` | `ImageDataResponseDto` (title/description/author/dateTaken/localization) |

Wszystkie ścieżki obrazów przychodzą **gotowe** w polach `coverUrl` / `lowResUrl` (patrz §3). Są **relatywne** (`/image/cover?id=…`) — dopnij bazę API (np. `NEXT_PUBLIC_API_URL`).

---

## 2. Endpointy — dokładny kontrakt

### 2.1 `GET /portfolio/galleries` — lista galerii (home)
- Auth: public. Query: brak.
- Zwraca **wszystkie opublikowane** galerie posortowane wg `sortOrder` (kolejność ustawiona przez admina drag&drop; tiebreaker `createdAt desc`).

### 2.2 `GET /portfolio/hero?limit=12` — „Selected Work"
- Auth: public. Query: `limit` (integer, opcjonalny, **domyślnie 12**).
- Zwraca zdjęcia z rolą **`HERO`** ze wszystkich opublikowanych galerii — na baner/carousel na home.

### 2.3 `GET /portfolio/galleries/:slug?orientation=` — pojedyncza galeria
- Auth: public. Path: `slug`. Query: `orientation` (opcjonalny enum: `LANDSCAPE` | `PORTRAIT` | `SQUARE`).
- **404** gdy slug nie istnieje lub galeria nie jest `PUBLISHED`.
- Zwraca galerię + `items[]` w kolejności `order`, **bez** zdjęć `HIDDEN`.
- `orientation` filtruje po stronie backendu. Możesz też pobrać raz bez filtra i przełączać zakładki lokalnie (mniej round-tripów, `imageCount` wtedy licz sam per zakładka).

### 2.4 Serwowanie obrazów (strumienie webp)
| Endpoint | Rozmiar | Jakość | Auth | Zastosowanie |
|---|---|---|---|---|
| `GET /image/cover?id=` | max **1920px** szer. | webp q80 | public | pełny obraz (grid + lightbox) |
| `GET /image/low-res?id=` | max **80px** szer. | webp q100 | public | placeholder blur-up |
| `GET /image/original?id=` | oryginał | — | **🔒 Bearer** | **niedostępny publicznie** — nie używaj |

> Istnieje bliźniaczy namespace `GET /gallery/cover|low-res?id=` (identyczne webp). Nie musisz go znać — używaj URL-i **tak, jak przychodzą** w odpowiedzi (`coverUrl`/`lowResUrl` wskazują na `/image/*`). Oryginał jest chroniony tokenem — pełnej jakości pliki nie wyciekają.

### 2.5 (opcjonalnie) `GET /image?id=` — metadane pojedynczego zdjęcia
- Auth: public. Zwraca `ImageDataResponseDto`: `author`, `dateTaken`, `title`, `description`, `localization`.
- Portfolio item (§3) **nie** niesie `title/description/author` — tylko `localization` + `exif`. Jeśli w lightboxie chcesz podpis/opis/autora, dociągnij to zdjęcie tym endpointem (lazy, przy otwarciu lightboxa).

---

## 3. Kształty odpowiedzi (dokładne, z `null`)

### `PortfolioGalleryListResponse` (`GET /portfolio/galleries`)
```jsonc
{
  "total": 3,
  "galleries": [
    {
      "id": "g-uuid",
      "title": "Komunie 2026",
      "slug": "komunie-2026",
      "description": "…" ,          // string | null
      "coverUrl": "/image/cover?id=cover-img", // string | null (null gdy brak coverImageId)
      "imageCount": 24              // liczba NIE-ukrytych zdjęć
    }
  ]
}
```

### `PortfolioGalleryDetailResponse` (`GET /portfolio/galleries/:slug`)
```jsonc
{
  "id": "g-uuid", "title": "Komunie 2026", "slug": "komunie-2026",
  "description": "…",                 // string | null
  "coverUrl": "/image/cover?id=cover-img", // string | null
  "imageCount": 24,
  "items": [ /* PortfolioImageResponse[] w kolejności order, bez HIDDEN */ ]
}
```

### `PortfolioHeroResponse` (`GET /portfolio/hero`)
```jsonc
{ "images": [ /* PortfolioImageResponse[] — same zdjęcia z rolą HERO */ ] }
```

### `PortfolioImageResponse` (element `items[]` / `images[]`)
```jsonc
{
  "imageId": "img-uuid",
  "order": 0,                       // integer, kolejność ustawiona przez admina
  "role": "HERO",                   // HERO | LARGE | NORMAL  (HIDDEN nigdy nie przychodzi)
  "coverUrl": "/image/cover?id=img-uuid",     // ZAWSZE (string)
  "lowResUrl": "/image/low-res?id=img-uuid",  // ZAWSZE (string)
  "width": 1600,                    // integer | null
  "height": 900,                    // integer | null
  "orientation": "LANDSCAPE",       // LANDSCAPE | PORTRAIT | SQUARE | null
  "localization": "Kraków",         // string | null — badge na kaflu
  "exif": {                          // ZAWSZE obiekt; pojedyncze pola null gdy brak
    "cameraMake": "FUJIFILM",       // string | null
    "cameraModel": "X-T5",          // string | null
    "lens": "XF35mmF2 R WR",        // string | null
    "focalLength": 35,              // number | null (mm)
    "fNumber": 2,                   // number | null (f/)
    "iso": 200,                     // integer | null
    "exposureTime": "1/250",        // string | null — gotowy do wyświetlenia
    "takenAt": "2026-01-31T14:20:00.000Z" // ISO date-time | null
  }
}
```

---

## 4. Model danych → jak renderować

- **`role`** — sterowanie hierarchią wizualną:
  - `HERO` → sekcja banerowa / carousel (i osobno feed z `/portfolio/hero`),
  - `LARGE` → kafel podwójnej szerokości / wyższy w masonry,
  - `NORMAL` → standardowy kafel,
  - `HIDDEN` → **nie przyjdzie** (backend odfiltrował).
- **`orientation`** — `LANDSCAPE` / `PORTRAIT` / `SQUARE`: zakładki filtrowania + podpowiedź do układu.
- **`order`** (w galerii) i **`sortOrder`** (kolejność galerii) — odwzorowują ręczne ułożenie admina. Renderuj **w tej kolejności**, nie sortuj po swojemu.
- **`width` / `height`** — ustawiaj `aspect-ratio` kontenera **zanim** obraz się wczyta → zero layout-shift w masonry. Mogą być `null` (zdjęcie jeszcze nieprzetworzone) → wtedy fallback (np. kwadrat / skeleton).

---

## 5. Budowa UI

### Home
1. **Hero „Selected Work"** — `GET /portfolio/hero?limit=12` → duży carousel/baner. Każdy slajd: `coverUrl` (blur-up z `lowResUrl`).
2. **Siatka galerii** — `GET /portfolio/galleries` → kafle: `coverUrl` galerii, `title`, opcjonalnie `imageCount`. Link → `/portfolio/[slug]`.

### Strona galerii (`/portfolio/[slug]`)
1. `GET /portfolio/galleries/:slug` (opcjonalnie z `?orientation=` gdy zakładka aktywna).
2. **Masonry** wg `width/height` + `role` (HERO/LARGE większe). Renderuj `items` w kolejności `order`.
3. **Zakładki orientacji** ALL / LANDSCAPE / PORTRAIT / SQUARE — filtruj lokalnie z pełnej listy albo przez query param.
4. **Kafel**: `<img>` z `coverUrl`; jeśli `localization` ≠ null → mały badge lokalizacji.
5. **Lightbox** (klik w kafel): pełny `coverUrl`, nawigacja prev/next po `items`, tech-specs z `exif`, opcjonalnie podpis z `GET /image?id=`.

### Blur-up (progresywne ładowanie)
```
1. Wstaw <img src={lowResUrl}> z filtrem blur + aspect-ratio z width/height  → natychmiastowy placeholder (80px webp)
2. W tle ładuj coverUrl (1920px webp); po onload podmień/zafeeduj i zdejmij blur
```
`lowResUrl` (80px, q100) jest maleńki — ładuje się od ręki; `coverUrl` (1920px, q80) to wersja docelowa. Oryginał (`/image/original`) jest chroniony — nie próbuj go pobierać.

### Formatowanie EXIF (lightbox „tech specs")
`exif` jest zawsze obiektem, ale **każde pole może być `null`** (RAW/RAF bez metadanych, zrzuty, zdjęcia sprzed przetworzenia). Pokazuj tylko obecne:
```ts
const specs = [
  exif.focalLength && `${exif.focalLength}mm`,
  exif.fNumber && `f/${exif.fNumber}`,
  exif.exposureTime,                 // już string: "1/250" / "2s"
  exif.iso && `ISO ${exif.iso}`,
].filter(Boolean).join(' · ');       // → "35mm · f/2 · 1/250 · ISO 200"

const camera = [exif.cameraMake, exif.cameraModel].filter(Boolean).join(' '); // "FUJIFILM X-T5"
```
Gdy **wszystkie** pola `exif` są `null` — nie renderuj bloku tech-specs (żeby nie było pustego boxa). `takenAt` to ISO string → `new Date(takenAt)`.

---

## 6. Stany i edge-case'y

- **404** na `/portfolio/galleries/:slug` = galeria nieopublikowana/nie istnieje → strona „nie znaleziono".
- **Pusta galeria** — `items: []` (opublikowana, ale bez widocznych zdjęć) → pokaż pusty stan, nie błąd.
- **`width/height/orientation = null`** — zdjęcie jeszcze nieprzetworzone; fallback aspect-ratio + skeleton, nie „brak danych".
- **`localization = null`** — nie renderuj badge. To pole opisowe (z `ImageData`), **nie** GPS z EXIF — bywa puste nawet przy pełnym EXIF.
- **`coverUrl` galerii = null** — galeria bez ustawionej okładki; użyj pierwszego `items[0].coverUrl` jako fallback (dociągając detail) lub neutralnego placeholdera.
- **Relatywne URL-e** — `coverUrl`/`lowResUrl` zaczynają się od `/image/…`; zawsze prefiksuj bazą API.

---

## 7. Wydajność / serwowanie

- Wszystkie publiczne wersje to **webp** — jeden format, mały rozmiar, CDN-ready. Ustaw długi `Cache-Control` na streamach (są immutable per `id`).
- Blur-up = szybki perceived-load; `lowResUrl` możesz też inline'ować jako `data:`-placeholder jeśli chcesz.
- `width/height` z API → rezerwuj miejsce (CLS = 0).
- Lazy-load kafli poza viewportem (`loading="lazy"` / IntersectionObserver).

---

## 8. Czego NIE ma (nie wymyślaj integracji)

Brak: page-buildera / sekcji, tagów i kategorii, croppingu/kadrowania, auto-SEO poza slugiem, statystyk/analityki/licznika wyświetleń, komentarzy/ocen/polubień, sprzedaży/wodnych znaków, wielu szablonów motywu, kont dla odwiedzających. Portfolio jest read-only.

---

## 9. TL;DR / checklista wdrożenia

- [ ] Home: `GET /portfolio/hero?limit=12` (baner) + `GET /portfolio/galleries` (siatka galerii).
- [ ] Galeria: `GET /portfolio/galleries/:slug` → masonry wg `width/height`+`role`, w kolejności `order`, bez HIDDEN.
- [ ] Zakładki orientacji (`?orientation=` lub lokalnie).
- [ ] Obrazy: `coverUrl` (1920 webp) + blur-up z `lowResUrl` (80 webp); prefiks bazy API; nie ruszaj `/image/original`.
- [ ] Lightbox: EXIF tech-specs (pola null → pomiń), badge `localization`, opcjonalnie podpis z `GET /image?id=`.
- [ ] Stany: 404 (nieopublikowana), pusta galeria, null-e wymiarów/EXIF/localization.
- [ ] Layout, animacje i „premium feel" = front. Backend daje tylko dane + kolejność.
