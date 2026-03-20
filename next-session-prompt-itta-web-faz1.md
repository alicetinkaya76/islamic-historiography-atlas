# İTTA Web Platform — Sonraki Oturum Prompt'u

## TAMAMLANAN: Faz 0 (19 Mart 2026)

### 1. Proje İskelet
- **Stack**: React 19 + Vite 8 + TypeScript + React Router 7 + Tailwind v4 + Fuse.js
- **i18n**: react-i18next ile 3 dil (TR/EN/AR), AR→EN→TR fallback, RTL desteği
- **Veri**: Statik JSON, build-time merge (İTTA + DİA)
- **Design**: Scholarly-editorial tema (Crimson Pro + Amiri + Source Sans, warm parchment palette)

### 2. Veri Birleştirme
- `scripts/merge-data.js` → `public/data/` altına 4 JSON üretir:
  - `itta_authors.json` (2,337 tarihçi, DİA enriched: arabic_name, importance_score, fields)
  - `itta_works.json` (2,249 kaynak)
  - `itta_relations.json` (3,356 ilişki: TEACHER_OF, STUDENT_OF, CONTEMPORARY_OF)
  - `itta_stats.json` (havza/yüzyıl/tür dağılımları)
- DİA eşleşme: 1,127/2,337 tarihçi (dia_slug ile)
- Ham veriler: `raw-data/` klasöründe

### 3. Sayfalar
- ✅ Dashboard (hero, stat kartları, havza barları, yüzyıl grafiği, tür donut, öne çıkan tarihçiler)
- ✅ ScholarList (arama + havza/yüzyıl filtresi, tablo, 100 limit)
- ✅ ScholarDetail (meta panel, eserler, hoca-talebe-çağdaş ilişkileri, DİA link)
- ✅ SourceList (arama + havza/tür filtresi, tablo)
- ✅ SourceDetail (meta, tanıtım metni)
- ⏳ MapView (placeholder — Leaflet, Faz 2)
- ⏳ NetworkView (placeholder — D3-force, Faz 3)
- ⏳ TimelineView (placeholder — D3, Faz 3)

### 4. Hooks & Utilities
- `useData.ts` — JSON yükleme + cache (useAuthors, useWorks, useRelations, useStats)
- `useSearch.ts` — Fuse.js wrapper
- `useDirection.ts` — RTL/LTR hook
- `useLocalized.ts` — çok dilli alan helper
- `colors.ts` — HAVZA_COLORS, TYPE_COLORS, HAVZA_ORDER

---

## SONRAKI OTURUM: Faz 1 + Faz 2

### A. Faz 1 — Dashboard & Arama İyileştirmeleri
1. **Global arama** (SearchBar komponenti) — Fuse.js ile tarihçi+kaynak birlikte aranır
2. **Pagination** — Scholar/Source listelerinde infinite scroll veya sayfalama
3. **URL state** — filtreler URL'de saklanır (?havza=iran&century=14)
4. **Responsive polish** — mobil navbar (hamburger menü)

### B. Faz 2 — Harita (Leaflet)
1. **npm install leaflet react-leaflet @types/leaflet**
2. `HavzaMap.tsx` — ana harita komponenti:
   - Havza sınırları GeoJSON (oluşturulacak veya basit polygon)
   - Tarihçi marker'ları (şehir bazlı, cluster)
   - Havza renkleri ile choropleth
   - Popup'lar (tarihçi adı, vefat, eser sayısı → detail link)
3. `havza_geo.json` — havza polygon verileri (basit sınırlar)
4. `MapView.tsx` — filtre paneli + harita
5. Havza tıklanınca → HavzaDetail sayfası (o havzanın tarihçileri/eserleri)

### C. Havza Detay Sayfası
- `/havza/:id` route
- Havza istatistikleri (tarihçi/eser sayısı, yüzyıl dağılımı)
- O havzanın tarihçi listesi
- O havzanın ilişki ağı (mini network)

---

## YÜKLENMESİ GEREKEN DOSYALAR
- **ITTA_web_project.zip** — tüm proje dosyaları (bu oturumdaki çıktı)
  - `npm install` sonrası `npm run merge && npm run build` ile derlenebilir

## PROMPT

```
İTTA (İslam Tarihyazım Tarihi Atlası) web platformuna devam ediyoruz.

Faz 0 tamamlandı: React+Vite+TS+i18n+Tailwind+Fuse.js iskelet.
Dashboard, Scholar/Source list+detail sayfaları, veri birleştirme (2,337 tarihçi, 2,249 kaynak, 3,356 ilişki) çalışıyor.

Bu oturum Faz 1 + Faz 2:
1. Global arama bileşeni (tarihçi+kaynak birlikte)
2. Pagination veya infinite scroll
3. URL state ile filtre senkronizasyonu
4. Leaflet harita entegrasyonu (havza sınırları, tarihçi marker'ları, choropleth)
5. Havza detay sayfası

Stack: React 19 + Vite 8 + TypeScript + Tailwind v4 + react-i18next + Fuse.js
Veri: public/data/ altında statik JSON (merge-data.js ile üretildi)
```
