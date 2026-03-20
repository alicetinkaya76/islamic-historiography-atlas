# İTTA Web Platform — Sonraki Oturum Prompt'u (Faz 4)

## TAMAMLANAN: Faz 0 (19 Mart 2026)

### 1. Proje İskelet
- **Stack**: React 19 + Vite 8 + TypeScript + React Router 7 + Tailwind v4 + Fuse.js + D3.js 7
- **i18n**: react-i18next ile 3 dil (TR/EN/AR), AR→EN→TR fallback, RTL desteği
- **Veri**: Statik JSON, build-time merge (İTTA + DİA)
- **Design**: Scholarly-editorial tema (Crimson Pro + Amiri + Source Sans, warm parchment palette)

### 2. Veri Birleştirme
- `scripts/merge-data.js` → `public/data/` altına 4+2 JSON üretir:
  - `itta_authors.json` (2,337 tarihçi, DİA enriched)
  - `itta_works.json` (2,249 kaynak)
  - `itta_relations.json` (3,356 ilişki: TEACHER_OF, STUDENT_OF, CONTEMPORARY_OF)
  - `itta_stats.json` (havza/yüzyıl/tür dağılımları)
  - `city_coords.json` (130+ şehir geocode)
  - `havza_geo.json` (8 havza polygon)
- DİA eşleşme: 1,127/2,337 tarihçi (dia_slug ile)

---

## TAMAMLANAN: Faz 1 + Faz 2 (20 Mart 2026)
- ✅ GlobalSearch (navbar'da, Fuse.js, combined tarihçi+kaynak)
- ✅ Pagination (ScholarList, SourceList, 50/sayfa)
- ✅ URL State (searchParams senkronize)
- ✅ Responsive Navbar (hamburger 640px altı)
- ✅ Leaflet harita (havza sınırları, 130+ şehir, popup, filtre)
- ✅ HavzaDetail (/havza/:id — stats, yüzyıl/tür dağılımı, şehirler, tarihçiler)

## TAMAMLANAN: Faz 3 (20 Mart 2026)

### Faz 3a — D3-Force Ağ Grafı (NetworkView)
- ✅ **NetworkView** (`src/pages/NetworkView.tsx`, 539 satır)
  - d3-force simülasyonu ile interaktif ağ görselleştirme
  - Node boyutu = importance_score + degree, Node rengi = havza rengi
  - Edge türleri: TEACHER_OF (yönlü ok), STUDENT_OF (yönlü ok), CONTEMPORARY_OF (kesikli)
  - Hover: bağlantılı node'lar highlight, diğerleri soluk
  - Tıklama: detay panel (sağ sidebar) — meta bilgiler + bağlantılı tarihçi listesi
  - Çift tıklama: tarihçi sayfasına git
  - Sürükle: node pozisyon değiştirme
  - Zoom/pan: d3-zoom
  - Filtre: havza, yüzyıl, ilişki türü (URL state ile senkronize)
  - "Tüm bağlantıları göster" toggle (both_in_itta filtresi)
  - Sol legend: havza renkleri + ilişki türü çizgileri
  - Önemli node'lara (importance>40 veya degree>4) isim etiketi

### Faz 3b — D3 Zaman Çizelgesi (TimelineView)
- ✅ **TimelineView** (`src/pages/TimelineView.tsx`, 400 satır)
  - Yatay D3 zaman çizelgesi (600–2000 CE)
  - Y ekseni: havza bantları (renk kodlu, label'lı)
  - Her tarihçi bir nokta (vefat yılı pozisyonu, boyut = importance)
  - Jitter: aynı bant içinde pseudo-random dağılım
  - Dönem bantları: Teşekkül / Gelişim / Daralma (arka plan renkleri)
  - D3 brushX: zaman aralığı seçimi → filtreleme + tarihçi listesi
  - Mini histogram: brush alanında yüzyıl dağılımı
  - Hover tooltip: tarihçi bilgileri
  - Tıklama: tarihçi sayfasına git
  - Havza chip filtreleri (tıklanabilir, aktif state)

### Faz 3c — Mini Network Widget
- ✅ **MiniNetwork** (`src/components/MiniNetwork.tsx`, 184 satır)
  - ScholarDetail sayfasında (dia_slug olan tarihçiler için)
  - Küçük d3-force grafı: merkez node + bağlantılı node'lar (max 20)
  - Tıklanabilir node'lar → tarihçi sayfasına
  - "Tam ağ görselleştirme →" linki (NetworkView'e)

### Faz 3d — Code Splitting
- ✅ **React.lazy** ile tüm sayfa bileşenleri lazy-load
  - Dashboard: eager load (landing page)
  - Diğer tümü: lazy (ScholarList, ScholarDetail, SourceList, SourceDetail, MapView, HavzaDetail, NetworkView, TimelineView)
  - Suspense fallback: loading spinner
  - Placeholders.tsx kaldırıldı

### Yeni/Güncellenen Dosyalar
```
src/pages/NetworkView.tsx              — YENİ (D3-force ağ grafı)
src/pages/TimelineView.tsx             — YENİ (D3 zaman çizelgesi)
src/components/MiniNetwork.tsx         — YENİ (mini ağ widget)
src/router.tsx                         — YENİDEN YAZILDI (React.lazy code splitting)
src/pages/Placeholders.tsx             — SİLİNDİ
src/pages/ScholarDetail.tsx            — GÜNCELLENDİ (+MiniNetwork entegrasyonu)
src/index.css                          — GÜNCELLENDİ (+78 satır yeni CSS)
src/i18n/locales/tr/common.json        — GÜNCELLENDİ (network.* + timeline.* keys)
src/i18n/locales/en/common.json        — GÜNCELLENDİ (network.* + timeline.* keys)
src/i18n/locales/ar/common.json        — GÜNCELLENDİ (network.* + timeline.* keys)
package.json                           — GÜNCELLENDİ (+d3, @types/d3)
```

### Build İstatistikleri
- TypeScript: ✅ hatasız
- Vite build: ✅ code-split
  - NetworkView chunk: 14.95 kB (5.05 gzip)
  - TimelineView chunk: 22.28 kB (8.29 gzip)
  - MiniNetwork chunk: 3.10 kB (1.48 gzip)
  - D3 paylaşımlı: ~175 kB (manyBody + colors + src)
  - Ana bundle (index): 272 kB (87 gzip)
- Toplam yeni kod: ~1,557 satır

---

## SONRAKI OTURUM: Faz 4 — İyileştirmeler & Yeni Özellikler

### A. Veri İyileştirmeleri
1. **About sayfası** — Proje hakkında, metodoloji, kaynaklar, ekip
2. **Export** — CSV/JSON export butonu scholar/source listelerinde
3. **Breadcrumb** navigation (Dashboard > Scholars > Scholar X)

### B. Görsel İyileştirmeler
1. **Dark mode** — CSS variable bazlı tema değişimi, toggle butonu
2. **Responsive iyileştirmeler** — NetworkView mobil deneyimi
3. **Animasyonlar** — Dashboard ve liste geçiş animasyonları

### C. Veri Zenginleştirme
1. **Hoca-talebe zinciri** (silsile) — ScholarDetail'de çok kuşaklı zincir görselleştirme
2. **İstatistik sayfası** — Detaylı istatistikler, grafikler, karşılaştırmalar
3. **Havza karşılaştırma** — İki havzayı yan yana kıyaslama

### D. Performans
1. **Virtual scrolling** — Büyük listelerde react-virtualized
2. **Web Worker** — D3 simülasyonu worker'da çalıştırma
3. **PWA** — Service worker, offline desteği

---

## YÜKLENMESİ GEREKEN DOSYALAR
- **ITTA_Web_Faz3.zip** — tüm proje dosyaları
  - `npm install` sonrası `npm run build` ile derlenebilir

## PROMPT

```
İTTA (İslam Tarihyazım Tarihi Atlası) web platformuna devam ediyoruz.

Faz 0-3 tamamlandı:
- React+Vite+TS+i18n+Tailwind+Fuse.js+Leaflet+D3 iskeleti
- Dashboard, Scholar/Source list+detail (URL state, pagination)
- GlobalSearch, Leaflet harita, HavzaDetail
- D3-force ağ grafı (NetworkView) — ilişki ağı görselleştirme
- D3 zaman çizelgesi (TimelineView) — kronolojik dağılım + brush
- MiniNetwork widget (ScholarDetail'de)
- Code splitting (React.lazy)
- 2,337 tarihçi, 2,249 kaynak, 3,356 ilişki

Bu oturum Faz 4:
1. Dark mode (CSS variable bazlı)
2. About sayfası
3. CSV/JSON export
4. Breadcrumb navigation
5. İstatistik sayfası (detaylı grafikler)

Stack: React 19 + Vite 8 + TypeScript + Tailwind v4 + react-i18next + Fuse.js + Leaflet + D3
```
