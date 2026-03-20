# İTTA Web Platform — Sonraki Oturum Prompt'u (Faz 3)

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

### 3. Faz 0 Sayfaları
- ✅ Dashboard (hero, stat kartları, havza barları, yüzyıl grafiği, tür donut, öne çıkan tarihçiler)
- ✅ ScholarList (arama + havza/yüzyıl filtresi, tablo, 100 limit)
- ✅ ScholarDetail (meta panel, eserler, hoca-talebe-çağdaş ilişkileri, DİA link)
- ✅ SourceList (arama + havza/tür filtresi, tablo)
- ✅ SourceDetail (meta, tanıtım metni)

---

## TAMAMLANAN: Faz 1 + Faz 2 (20 Mart 2026)

### Faz 1 — Dashboard & Arama İyileştirmeleri
- ✅ **GlobalSearch** bileşeni (`src/components/layout/GlobalSearch.tsx`)
  - Navbar'a entegre, Fuse.js ile tarihçi + kaynak birlikte aranır
  - Keyboard navigation (↑↓Enter/Esc), dropdown sonuçlar
  - Havza/tür renk dot'ları, meta bilgiler
- ✅ **Pagination** (`src/components/ui/Pagination.tsx`)
  - ScholarList ve SourceList'te 50/sayfa sayfalama
  - Sayfa numaraları, ileri/geri butonları, akıllı range (1...5 6 7...47)
- ✅ **URL State**
  - ScholarList: `?havza=iran&century=14&q=taberi&page=2`
  - SourceList: `?havza=misir&type=hanedan_tarihi&q=&page=3`
  - useSearchParams ile senkronize, filtre değişince page sıfırlanır
- ✅ **Responsive Navbar**
  - Hamburger menü (640px altı), animasyonlu üç çizgi → çarpı
  - Mobilde full-width dropdown, tıklanınca kapanır

### Faz 2 — Leaflet Harita
- ✅ **Leaflet + react-leaflet** kurulumu
- ✅ **MapView** (`src/pages/MapView.tsx`)
  - CARTO Light basemap, havza GeoJSON sınırları (dashed, renk kodlu)
  - 130+ şehir geocoded (`public/data/city_coords.json`)
  - CircleMarker'lar (boyut = √scholar sayısı), havza renkleri
  - Popup: şehir adı, havza, tarihçi/eser sayısı, ilk 6 tarihçi linki
  - Sol panel: havza legend (tıklanabilir filtre)
  - Sağ sidebar: seçilen şehirdeki tüm tarihçiler detay listesi
  - Filtre: havza tıklanınca sadece o havza gösterilir, tekrar tıklanınca tümü
- ✅ **HavzaDetail** (`src/pages/HavzaDetail.tsx`, `/havza/:id`)
  - 4 stat kartı (tarihçi/kaynak/ilişki/şehir sayısı)
  - Yüzyıl dağılımı çubuk grafiği (havza rengiyle)
  - Eser türü dağılımı barları
  - Başlıca şehirler barları
  - Öne çıkan tarihçiler grid'i
  - ScholarList'e "tümünü göster" linki (?havza=X ile)
- ✅ **havza_geo.json** — 8 havza için basit GeoJSON polygon'lar
- ✅ **city_coords.json** — 130+ şehir için [lat, lng] çiftleri

### Yeni/Güncellenen Dosyalar
```
src/components/layout/GlobalSearch.tsx   — YENİ (global arama)
src/components/layout/Navbar.tsx         — GÜNCELLENDİ (hamburger + GlobalSearch)
src/components/ui/Pagination.tsx         — YENİ (sayfalama)
src/pages/MapView.tsx                    — YENİ (Leaflet harita)
src/pages/HavzaDetail.tsx                — YENİ (havza detay)
src/pages/ScholarList.tsx                — GÜNCELLENDİ (URL state + pagination)
src/pages/SourceList.tsx                 — GÜNCELLENDİ (URL state + pagination)
src/pages/Placeholders.tsx               — GÜNCELLENDİ (MapView kaldırıldı)
src/router.tsx                           — GÜNCELLENDİ (MapView + HavzaDetail route)
src/hooks/useData.ts                     — GÜNCELLENDİ (CityCoords + HavzaGeo hooks)
src/index.css                            — GÜNCELLENDİ (+96 satır yeni CSS)
src/i18n/locales/*/common.json           — GÜNCELLENDİ (map.* ve common.more keys)
public/data/city_coords.json             — YENİ (130+ şehir geocode)
public/data/havza_geo.json               — YENİ (8 havza polygon)
```

### İstatistikler
- Toplam 1,169 satır yeni/değiştirilmiş kod
- TypeScript build: ✅ hatasız
- Vite build: ✅ (554 kB JS gzipped 170 kB)
- Leaflet CSS: CDN'den değil, npm paketinden import

---

## SONRAKI OTURUM: Faz 3 — Ağ Görselleştirme & Zaman Çizelgesi

### A. Faz 3a — D3-Force Ağ Grafı (NetworkView)
1. **d3-force** entegrasyonu (d3-force + d3-selection, veya vis-network alternatif)
2. `NetworkView.tsx` — ana ağ görselleştirme:
   - İlişki verisinden (3,356 edge) graf oluşturma
   - Node boyutu = importance_score veya eser_sayisi
   - Node rengi = havza rengi
   - Edge türleri: TEACHER_OF (yönlü ok), STUDENT_OF, CONTEMPORARY_OF
   - Hover/tıklama: tarihçi detay popup, ilgili node'lar highlight
   - Filtre: havza, yüzyıl, ilişki türü
   - Zoom/pan, mini-map
3. Mini network widget: ScholarDetail ve HavzaDetail sayfalarında
4. Cluster detection: havza bazlı grouping

### B. Faz 3b — D3 Zaman Çizelgesi (TimelineView)
1. `TimelineView.tsx` — yatay zaman çizelgesi:
   - X ekseni: miladi yıllar (600–2000)
   - Y ekseni: havza bantları
   - Her tarihçi bir nokta (vefat yılı pozisyonu)
   - Tooltip: tarihçi bilgileri
   - Brush: zaman aralığı seçimi → filtreleme
2. Dönem bantları: Teşekkül (7-10. yy), Gelişim (11-18. yy), Daralma (19-20. yy)
3. İsteğe bağlı: Eser timeline (yazılma tarihi ile)

### C. Genel İyileştirmeler
1. **Code splitting** — React.lazy ile sayfa bazlı bundle (Vite warning çözmek için)
2. **Dark mode** — CSS variable bazlı tema değişimi
3. **Export** — CSV/JSON export butonu scholar/source listelerinde
4. **Breadcrumb** navigation
5. **SEO** — React Helmet ile meta tags

---

## YÜKLENMESİ GEREKEN DOSYALAR
- **ITTA_Web_Faz2.zip** — tüm proje dosyaları
  - `npm install` sonrası `npm run build` ile derlenebilir (merge gerekmez, data public/data/ altında)

## PROMPT

```
İTTA (İslam Tarihyazım Tarihi Atlası) web platformuna devam ediyoruz.

Faz 0-2 tamamlandı:
- React+Vite+TS+i18n+Tailwind+Fuse.js+Leaflet iskeleti
- Dashboard, Scholar/Source list+detail (URL state, pagination)
- GlobalSearch (navbar'da, combined tarihçi+kaynak)
- Leaflet harita (havza sınırları, 130+ şehir marker, popup, filtre)
- HavzaDetail sayfası (stats, yüzyıl/tür dağılımı, şehirler)
- 2,337 tarihçi, 2,249 kaynak, 3,356 ilişki

Bu oturum Faz 3:
1. D3-force ağ grafı (NetworkView) — ilişki ağı görselleştirme
2. Zaman çizelgesi (TimelineView) — tarihçilerin kronolojik dağılımı
3. Code splitting (React.lazy)
4. Mini network widget (ScholarDetail/HavzaDetail)

Stack: React 19 + Vite 8 + TypeScript + Tailwind v4 + react-i18next + Fuse.js + Leaflet
İlişki verisi: itta_relations.json (3,356 edge: TEACHER_OF, STUDENT_OF, CONTEMPORARY_OF)
```
