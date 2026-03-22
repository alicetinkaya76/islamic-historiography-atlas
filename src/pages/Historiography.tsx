import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useAuthors, useWorks, useHistoriography } from '../hooks/useData';
import { HAVZA_COLORS, getPeriodId } from '../utils/colors';

export default function Historiography() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language === 'en' ? 'en' : 'tr';
  const { authors, loading: aLoad } = useAuthors();
  const { works, loading: wLoad } = useWorks();
  const { histData, loading: hLoad } = useHistoriography();
  const [viewMode, setViewMode] = useState<'cards' | 'map'>('cards');

  // Stats per basin
  const basinStats = useMemo(() => {
    const stats: Record<string, { scholars: number; sources: number; avgCentury: number }> = {};
    for (const a of authors) {
      if (!stats[a.havza]) stats[a.havza] = { scholars: 0, sources: 0, avgCentury: 0 };
      stats[a.havza].scholars++;
    }
    for (const w of works) {
      if (!stats[w.havza]) stats[w.havza] = { scholars: 0, sources: 0, avgCentury: 0 };
      stats[w.havza].sources++;
    }
    // Average century
    for (const key of Object.keys(stats)) {
      const bas = authors.filter(a => a.havza === key && a.yuzyil);
      if (bas.length) {
        stats[key].avgCentury = Math.round(bas.reduce((s, a) => s + (a.yuzyil || 0), 0) / bas.length);
      }
    }
    return stats;
  }, [authors, works]);

  if (aLoad || wLoad || hLoad) {
    return <div className="loading-screen">{t('common.loading')}</div>;
  }

  const basins = histData?.basins || [];

  return (
    <div className="historiography-page">
      <header className="period-hero">
        <div className="hero-pattern" />
        <h1 className="hero-title">{t('historiography.title')}</h1>
        <p className="hero-subtitle">{t('historiography.subtitle')}</p>
      </header>

      {/* View Mode Toggle */}
      <div className="hist-view-toggle">
        <button
          className={`toggle-btn ${viewMode === 'cards' ? 'active' : ''}`}
          onClick={() => setViewMode('cards')}
        >
          {t('historiography.card_mode')}
        </button>
        <button
          className={`toggle-btn ${viewMode === 'map' ? 'active' : ''}`}
          onClick={() => setViewMode('map')}
        >
          {t('historiography.map_mode')}
        </button>
      </div>

      {/* Basin Cards */}
      <section className="hist-basin-grid">
        {basins.map(basin => {
          const color = HAVZA_COLORS[basin.havza_key] || basin.color;
          const st = basinStats[basin.havza_key] || { scholars: 0, sources: 0, avgCentury: 0 };
          const dynCount = basin.dynasties.length;

          // Period flow mini
          const periodCounts: Record<string, number> = { formation: 0, development: 0, contraction: 0 };
          for (const a of authors.filter(au => au.havza === basin.havza_key)) {
            const pid = getPeriodId(a.yuzyil);
            if (pid && periodCounts[pid] !== undefined) periodCounts[pid]++;
          }

          return (
            <div key={basin.id} className="hist-basin-card" style={{ borderColor: color }}>
              <div className="hist-basin-header" style={{ background: `${color}10` }}>
                <div className="hist-basin-dot" style={{ background: color }} />
                <h2 className="hist-basin-name" style={{ color }}>{t(`havza_names.${basin.havza_key}`)}</h2>
              </div>

              <div className="hist-basin-stats">
                <div className="hist-stat">
                  <span className="hist-stat-val" style={{ color }}>{st.scholars}</span>
                  <span className="hist-stat-label">{t('stats.scholars')}</span>
                </div>
                <div className="hist-stat">
                  <span className="hist-stat-val" style={{ color }}>{st.sources}</span>
                  <span className="hist-stat-label">{t('stats.sources')}</span>
                </div>
                <div className="hist-stat">
                  <span className="hist-stat-val" style={{ color }}>{dynCount}</span>
                  <span className="hist-stat-label">{t('historiography.dynasties')}</span>
                </div>
                <div className="hist-stat">
                  <span className="hist-stat-val" style={{ color }}>{st.avgCentury || '—'}{st.avgCentury ? t('dashboard.century_suffix') : ''}</span>
                  <span className="hist-stat-label">{t('statistics.avg_century')}</span>
                </div>
              </div>

              {/* Period Flow */}
              <div className="hist-period-flow">
                {(['formation', 'development', 'contraction'] as const).map((pid, idx) => (
                  <span key={pid} className="period-flow-item">
                    <span className="period-flow-dot" style={{ background: pid === 'formation' ? '#1565C0' : pid === 'development' ? '#2E7D32' : '#E65100' }} />
                    <span className="period-flow-count">{periodCounts[pid]}</span>
                    {idx < 2 && <span className="period-flow-arrow">→</span>}
                  </span>
                ))}
              </div>

              <div className="hist-basin-actions">
                <Link to={`/historiography/${basin.id}`} className="hist-action-primary" style={{ background: color }}>
                  {t('historiography.detail')} →
                </Link>
                <Link to={`/scholars?havza=${basin.havza_key}`} className="hist-action-link">
                  {t('nav.scholars')} →
                </Link>
                <Link to={`/map?havza=${basin.havza_key}`} className="hist-action-link">
                  {t('nav.map')} →
                </Link>
              </div>
            </div>
          );
        })}
      </section>

      {/* Cross-link to Periodization */}
      <section className="hist-crosslink">
        <Link to="/periodization" className="crosslink-card">
          <span className="crosslink-icon">◈</span>
          <div>
            <h3>{t('periodization.title')}</h3>
            <p>{t('periodization.subtitle')}</p>
          </div>
          <span className="crosslink-arrow">→</span>
        </Link>
      </section>
    </div>
  );
}
