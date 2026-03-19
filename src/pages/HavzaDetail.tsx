import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthors, useWorks, useRelations } from '../hooks/useData';
import { HAVZA_COLORS, TYPE_COLORS, HAVZA_ORDER } from '../utils/colors';

export default function HavzaDetail() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { authors, loading: aLoading } = useAuthors();
  const { works, loading: wLoading } = useWorks();
  const { relations, loading: rLoading } = useRelations();

  const havzaAuthors = useMemo(() => authors.filter(a => a.havza === id), [authors, id]);
  const havzaWorks = useMemo(() => works.filter(w => w.havza === id), [works, id]);

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

  const typeCounts = useMemo(() => {
    const m: Record<string, number> = {};
    for (const w of havzaWorks) {
      m[w.eser_turu] = (m[w.eser_turu] || 0) + 1;
    }
    return Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, 10);
  }, [havzaWorks]);

  const cityCounts = useMemo(() => {
    const m: Record<string, number> = {};
    for (const a of havzaAuthors) {
      const c = (a.sehir || '').trim();
      if (c) m[c] = (m[c] || 0) + 1;
    }
    return Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, 12);
  }, [havzaAuthors]);

  const topScholars = useMemo(() => {
    return [...havzaAuthors]
      .sort((a, b) => (b.importance_score || 0) - (a.importance_score || 0))
      .slice(0, 12);
  }, [havzaAuthors]);

  const havzaRelations = useMemo(() => {
    const slugs = new Set(havzaAuthors.filter(a => a.dia_slug).map(a => a.dia_slug));
    return relations.filter(r => slugs.has(r.source) || slugs.has(r.target));
  }, [havzaAuthors, relations]);

  const color = HAVZA_COLORS[id || ''] || '#666';
  const maxCentury = Math.max(...centuryCounts.map(e => e.count), 1);

  if (aLoading || wLoading || rLoading) return <div className="loading-screen">{t('common.loading')}</div>;
  if (!id || !HAVZA_ORDER.includes(id)) return <div className="loading-screen">{t('scholar_detail.no_data')}</div>;

  return (
    <div className="detail-page havza-detail">
      <Link to="/map" className="back-link">← {t('nav.map')}</Link>

      <header className="detail-header">
        <span className="detail-havza-badge" style={{ background: color }}>
          {t(`havza_names.${id}`)}
        </span>
        <h1 className="detail-name">{t(`havza_names.${id}`)}</h1>
      </header>

      {/* Stats Row */}
      <div className="havza-stats-row">
        <div className="havza-stat">
          <div className="havza-stat-value" style={{ color }}>{havzaAuthors.length}</div>
          <div className="havza-stat-label">{t('stats.scholars')}</div>
        </div>
        <div className="havza-stat">
          <div className="havza-stat-value" style={{ color }}>{havzaWorks.length}</div>
          <div className="havza-stat-label">{t('stats.sources')}</div>
        </div>
        <div className="havza-stat">
          <div className="havza-stat-value" style={{ color }}>{havzaRelations.length}</div>
          <div className="havza-stat-label">{t('stats.relations')}</div>
        </div>
        <div className="havza-stat">
          <div className="havza-stat-value" style={{ color }}>{cityCounts.length}</div>
          <div className="havza-stat-label">{t('map.cities')}</div>
        </div>
      </div>

      <div className="havza-detail-grid">
        {/* Century Distribution */}
        <section className="dash-card">
          <h2 className="card-title">{t('dashboard.century_overview')}</h2>
          <div className="century-chart">
            {centuryCounts.map(e => (
              <div key={e.century} className="century-col">
                <div className="century-bar-wrap">
                  <div
                    className="century-bar"
                    style={{ height: `${(e.count / maxCentury) * 100}%`, background: color }}
                    title={`${e.count}`}
                  />
                </div>
                <div className="century-label">{e.century}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Type Distribution */}
        <section className="dash-card">
          <h2 className="card-title">{t('dashboard.type_overview')}</h2>
          <div className="havza-type-bars">
            {typeCounts.map(([type, count]) => (
              <div key={type} className="havza-bar">
                <div className="havza-bar-label">
                  <span className="havza-dot" style={{ background: TYPE_COLORS[type] || '#999' }} />
                  <span>{t(`source_types.${type}`)}</span>
                </div>
                <div className="havza-bar-track">
                  <div
                    className="havza-bar-fill"
                    style={{ width: `${(count / typeCounts[0][1]) * 100}%`, background: TYPE_COLORS[type] || '#999' }}
                  />
                </div>
                <span className="havza-bar-count">{count}</span>
              </div>
            ))}
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
                  <div
                    className="havza-bar-fill"
                    style={{ width: `${(count / cityCounts[0][1]) * 100}%`, background: color }}
                  />
                </div>
                <span className="havza-bar-count">{count}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Top Scholars */}
        <section className="dash-card">
          <h2 className="card-title">{t('dashboard.recent_scholars')}</h2>
          <div className="featured-grid">
            {topScholars.map(s => (
              <Link key={s.author_id} to={`/scholars/${s.author_id}`} className="scholar-chip">
                <span className="chip-dot" style={{ background: color }} />
                <div className="chip-info">
                  <span className="chip-name">{s.meshur_isim}</span>
                  <span className="chip-meta">
                    {s.vefat_yili_m ? `ö. ${s.vefat_yili_m}` : ''} · {s.eser_sayisi} {t('common.work_count')}
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <Link to={`/scholars?havza=${id}`} className="show-all-link">
            {t('common.show_all')} {t('nav.scholars')} →
          </Link>
        </section>
      </div>
    </div>
  );
}
