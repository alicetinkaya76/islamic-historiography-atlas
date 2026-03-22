import { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthors, useWorks, useRelations, useHistoriography } from '../hooks/useData';
import { HAVZA_COLORS, PERIOD_COLORS, getPeriodId } from '../utils/colors';

const PERIOD_IDS = ['formation', 'development', 'contraction'] as const;

export default function HistoriographyDetail() {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const lang = i18n.language === 'en' ? 'en' : 'tr';
  const { authors, loading: aLoad } = useAuthors();
  const { works, loading: wLoad } = useWorks();
  const { relations, loading: rLoad } = useRelations();
  const { histData, loading: hLoad } = useHistoriography();

  const [openPeriod, setOpenPeriod] = useState<string>('formation');

  const basin = useMemo(() => histData?.basins.find(b => b.id === id), [histData, id]);
  const havzaKey = basin?.havza_key || id || '';
  const color = HAVZA_COLORS[havzaKey] || basin?.color || '#666';

  const havzaAuthors = useMemo(() => authors.filter(a => a.havza === havzaKey), [authors, havzaKey]);
  const havzaWorks = useMemo(() => works.filter(w => w.havza === havzaKey), [works, havzaKey]);

  const havzaRelations = useMemo(() => {
    const slugs = new Set(havzaAuthors.filter(a => a.dia_slug).map(a => a.dia_slug));
    return relations.filter(r => slugs.has(r.source) || slugs.has(r.target));
  }, [havzaAuthors, relations]);

  // Scholars by period
  const scholarsByPeriod = useMemo(() => {
    const result: Record<string, typeof authors> = {};
    for (const pid of PERIOD_IDS) {
      result[pid] = [...havzaAuthors]
        .filter(a => getPeriodId(a.yuzyil) === pid)
        .sort((a, b) => (b.importance_score || 0) - (a.importance_score || 0))
        .slice(0, 8);
    }
    return result;
  }, [havzaAuthors]);

  // Works by period
  const worksByPeriod = useMemo(() => {
    const result: Record<string, typeof works> = {};
    for (const pid of PERIOD_IDS) {
      const periodAuthorIds = new Set(
        havzaAuthors.filter(a => getPeriodId(a.yuzyil) === pid).map(a => a.author_id)
      );
      result[pid] = havzaWorks.filter(w => periodAuthorIds.has(w.author_id)).slice(0, 6);
    }
    return result;
  }, [havzaAuthors, havzaWorks]);

  // Century distribution
  const centuryCounts = useMemo(() => {
    const m: Record<number, number> = {};
    for (const a of havzaAuthors) {
      if (a.yuzyil) m[a.yuzyil] = (m[a.yuzyil] || 0) + 1;
    }
    return Object.entries(m)
      .map(([c, n]) => ({ century: parseInt(c), count: n }))
      .filter(e => e.century >= 7 && e.century <= 20)
      .sort((a, b) => a.century - b.century);
  }, [havzaAuthors]);

  const maxCentury = Math.max(...centuryCounts.map(e => e.count), 1);

  // Cities
  const cityCounts = useMemo(() => {
    const m: Record<string, number> = {};
    for (const a of havzaAuthors) {
      const c = (a.sehir || '').trim();
      if (c) m[c] = (m[c] || 0) + 1;
    }
    return Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, 10);
  }, [havzaAuthors]);

  if (aLoad || wLoad || rLoad || hLoad) return <div className="loading-screen">{t('common.loading')}</div>;
  if (!basin) return <div className="loading-screen">{t('scholar_detail.no_data')}</div>;

  return (
    <div className="detail-page hist-detail">
      <Link to="/historiography" className="back-link">← {t('historiography.title')}</Link>

      {/* Header */}
      <header className="detail-header">
        <span className="detail-havza-badge" style={{ background: color }}>
          {t(`havza_names.${havzaKey}`)}
        </span>
        <h1 className="detail-name">{t(`havza_names.${havzaKey}`)} — {t('historiography.title')}</h1>
      </header>

      {/* Stats Row */}
      <div className="havza-stats-row">
        <Link to={`/scholars?havza=${havzaKey}`} className="havza-stat">
          <div className="havza-stat-value" style={{ color }}>{havzaAuthors.length}</div>
          <div className="havza-stat-label">{t('stats.scholars')}</div>
        </Link>
        <Link to={`/sources?havza=${havzaKey}`} className="havza-stat">
          <div className="havza-stat-value" style={{ color }}>{havzaWorks.length}</div>
          <div className="havza-stat-label">{t('stats.sources')}</div>
        </Link>
        <div className="havza-stat">
          <div className="havza-stat-value" style={{ color }}>{havzaRelations.length}</div>
          <div className="havza-stat-label">{t('stats.relations')}</div>
        </div>
        <Link to={`/map?havza=${havzaKey}`} className="havza-stat">
          <div className="havza-stat-value" style={{ color }}>{cityCounts.length}</div>
          <div className="havza-stat-label">{t('map.cities')}</div>
        </Link>
      </div>

      {/* Quick Links */}
      <div className="hist-quick-links">
        <Link to={`/network?havza=${havzaKey}`} className="hist-quick-link">{t('periodization.show_network')} →</Link>
        <Link to={`/havza/${havzaKey}`} className="hist-quick-link">{t('historiography.havza_detail')} →</Link>
        <Link to={`/compare?h1=${havzaKey}`} className="hist-quick-link">{t('compare.title')} →</Link>
      </div>

      {/* Period Accordion */}
      <section className="hist-periods-section">
        <h2 className="section-title">{t('historiography.period_narrative')}</h2>
        {PERIOD_IDS.map(pid => {
          const isOpen = openPeriod === pid;
          const periodColor = PERIOD_COLORS[pid];
          const text = basin.periods[pid]?.[lang as 'tr' | 'en'] || '';
          const periodEntry = basin.periods[pid];
          const keyThemes = periodEntry?.key_themes || [];
          const keyHistorians = periodEntry?.key_historians || [];
          const dynasties = basin.dynasties.filter(d => d.period === pid);
          const scholars = scholarsByPeriod[pid] || [];
          const periodWorks = worksByPeriod[pid] || [];

          return (
            <div key={pid} className={`hist-accordion ${isOpen ? 'open' : ''}`}>
              <button
                className="hist-accordion-header"
                onClick={() => setOpenPeriod(isOpen ? '' : pid)}
                style={{ borderLeftColor: periodColor }}
              >
                <span className="accordion-dot" style={{ background: periodColor }} />
                <span className="accordion-title">{t(`periods.${pid}`)}</span>
                <span className="accordion-count">
                  {havzaAuthors.filter(a => getPeriodId(a.yuzyil) === pid).length} {t('stats.scholars').toLowerCase()}
                </span>
                <span className="accordion-chevron">{isOpen ? '▾' : '▸'}</span>
              </button>

              {isOpen && (
                <div className="hist-accordion-body">
                  {/* Narrative Text */}
                  <p className="hist-narrative">{text}</p>

                  {/* Key Themes */}
                  {keyThemes.length > 0 && (
                    <div className="hist-themes-section">
                      <h4 className="hist-sub-title">{t('historiography.key_themes')}</h4>
                      <div className="theme-chips">
                        {keyThemes.map((theme, i) => (
                          <span key={i} className="theme-chip" style={{ borderColor: periodColor, color: periodColor }}>
                            {theme}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Key Historians (from enrichment) */}
                  {keyHistorians.length > 0 && (
                    <div className="hist-historians-section">
                      <h4 className="hist-sub-title">{t('historiography.key_historians')}</h4>
                      <div className="historian-chips">
                        {keyHistorians.map((name, i) => (
                          <span key={i} className="historian-chip" style={{ background: `${periodColor}15`, borderColor: periodColor }}>
                            {name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Dynasties */}
                  {dynasties.length > 0 && (
                    <div className="hist-dynasties">
                      <h4 className="hist-sub-title">{t('historiography.dynasties')}</h4>
                      <div className="dynasty-chips">
                        {dynasties.map((d, i) => (
                          <span key={i} className="dynasty-chip" style={{ borderColor: periodColor }}>
                            {lang === 'en' ? d.name_en : d.name_tr}
                            <span className="dynasty-years">{d.years}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Key Scholars */}
                  {scholars.length > 0 && (
                    <div className="hist-scholars-section">
                      <h4 className="hist-sub-title">{t('periodization.key_scholars')}</h4>
                      <div className="period-scholar-chips">
                        {scholars.map(sc => (
                          <Link key={sc.author_id} to={`/scholars/${sc.author_id}`} className="scholar-chip-mini">
                            <span className="chip-dot" style={{ background: color }} />
                            <span>{sc.meshur_isim}</span>
                            {sc.vefat_yili_m && <span className="chip-year">ö. {sc.vefat_yili_m}</span>}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Key Works */}
                  {periodWorks.length > 0 && (
                    <div className="hist-works-section">
                      <h4 className="hist-sub-title">{t('scholar_detail.works')}</h4>
                      <div className="works-list">
                        {periodWorks.map(w => (
                          <Link key={w.work_id} to={`/sources/${w.work_id}`} className="work-item">
                            <span className="work-type-badge">{t(`source_types.${w.eser_turu}`)}</span>
                            <span className="work-title">{w.eser_adi}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </section>

      {/* Century Distribution */}
      <section className="dash-card">
        <h2 className="card-title">{t('dashboard.century_overview')}</h2>
        <div className="century-chart">
          {centuryCounts.map(e => {
            const pid = getPeriodId(e.century);
            const barColor = pid ? PERIOD_COLORS[pid] : color;
            return (
              <div key={e.century} className="century-col">
                <div className="century-bar-wrap">
                  <div
                    className="century-bar"
                    style={{ height: `${(e.count / maxCentury) * 100}%`, background: barColor }}
                    title={`${e.count}`}
                  />
                </div>
                <div className="century-label">{e.century}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Top Cities */}
      <section className="dash-card">
        <h2 className="card-title">{t('map.top_cities')}</h2>
        <div className="havza-type-bars">
          {cityCounts.map(([city, count]) => (
            <div key={city} className="havza-bar">
              <div className="havza-bar-label">
                <span className="havza-dot" style={{ background: color }} />
                <span>{city}</span>
              </div>
              <div className="havza-bar-track">
                <div className="havza-bar-fill" style={{ width: `${(count / cityCounts[0][1]) * 100}%`, background: color }} />
              </div>
              <span className="havza-bar-count">{count}</span>
            </div>
          ))}
        </div>
      </section>

      {/* References */}
      {basin.references.length > 0 && (
        <section className="period-references">
          <h2 className="section-title">{t('periodization.references')}</h2>
          <div className="ref-list">
            {basin.references.map((r, i) => (
              <div key={i} className="ref-item">
                <span>{r.citation}</span>
                {r.doi && <a href={r.doi} target="_blank" rel="noreferrer" className="ref-doi">{r.doi}</a>}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
