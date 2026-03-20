import { useTranslation } from 'react-i18next';
import { useStats } from '../hooks/useData';

export default function About() {
  const { t } = useTranslation();
  const { stats } = useStats();

  return (
    <div className="about-page">
      <header className="about-hero">
        <div className="hero-pattern" />
        <h1 className="hero-title">{t('about.title')}</h1>
        <p className="hero-subtitle">{t('about.subtitle')}</p>
      </header>

      <div className="about-content">
        {/* Project Description */}
        <section className="about-section">
          <h2 className="about-section-title">{t('about.what_title')}</h2>
          <p className="about-text">{t('about.what_text')}</p>
        </section>

        {/* Methodology */}
        <section className="about-section">
          <h2 className="about-section-title">{t('about.method_title')}</h2>
          <p className="about-text">{t('about.method_text')}</p>
        </section>

        {/* Data Sources */}
        <section className="about-section">
          <h2 className="about-section-title">{t('about.sources_title')}</h2>
          <div className="about-sources">
            <div className="about-source-card">
              <h3>MHTT</h3>
              <p>{t('about.source_mhtt')}</p>
            </div>
            <div className="about-source-card">
              <h3>DİA</h3>
              <p>{t('about.source_dia')}</p>
            </div>
          </div>
        </section>

        {/* Current Data Stats */}
        <section className="about-section">
          <h2 className="about-section-title">{t('about.data_title')}</h2>
          <div className="about-data-grid">
            <div className="about-data-item">
              <span className="about-data-value">{stats?.total_scholars?.toLocaleString() || '—'}</span>
              <span className="about-data-label">{t('stats.scholars')}</span>
            </div>
            <div className="about-data-item">
              <span className="about-data-value">{stats?.total_works?.toLocaleString() || '—'}</span>
              <span className="about-data-label">{t('stats.sources')}</span>
            </div>
            <div className="about-data-item">
              <span className="about-data-value">{stats?.total_havzas || '—'}</span>
              <span className="about-data-label">{t('stats.havzas')}</span>
            </div>
            <div className="about-data-item">
              <span className="about-data-value">{stats?.dia_matches?.toLocaleString() || '—'}</span>
              <span className="about-data-label">{t('stats.dia_links')}</span>
            </div>
            <div className="about-data-item">
              <span className="about-data-value">{stats?.dia_relations?.toLocaleString() || '—'}</span>
              <span className="about-data-label">{t('stats.relations')}</span>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="about-section">
          <h2 className="about-section-title">{t('about.team_title')}</h2>
          <div className="about-team-list">
            <div className="about-team-card about-team-lead">
              <div className="about-team-stripe" style={{ background: '#1565C0' }} />
              <div className="about-team-info">
                <h3>Prof. Dr. Abdulkadir Macit</h3>
                <p className="about-team-role">{t('about.team_macit_role')}</p>
                <p className="about-team-skills">{t('about.team_macit_skills')}</p>
                <p className="about-team-affil">{t('about.team_macit_affil')}</p>
              </div>
            </div>
            <div className="about-team-card">
              <div className="about-team-stripe" style={{ background: '#1565C0' }} />
              <div className="about-team-info">
                <h3>Dr. Ali Çetinkaya</h3>
                <p className="about-team-role">{t('about.team_ali_role')}</p>
                <p className="about-team-skills">{t('about.team_ali_skills')}</p>
                <p className="about-team-affil">{t('about.team_ali_affil')}</p>
              </div>
            </div>
            <div className="about-team-card">
              <div className="about-team-stripe" style={{ background: '#2E7D32' }} />
              <div className="about-team-info">
                <h3>Dr. Hüseyin Gökalp</h3>
                <p className="about-team-role">{t('about.team_huseyin_role')}</p>
                <p className="about-team-skills">{t('about.team_huseyin_skills')}</p>
                <p className="about-team-affil">{t('about.team_huseyin_affil')}</p>
              </div>
            </div>
            <div className="about-team-card">
              <div className="about-team-stripe" style={{ background: '#E65100' }} />
              <div className="about-team-info">
                <h3>Dr. Halil İbrahim Erol & Dr. Selahattin Polatoğlu</h3>
                <p className="about-team-role">{t('about.team_coord_role')}</p>
                <p className="about-team-skills">{t('about.team_coord_skills')}</p>
              </div>
            </div>
          </div>
          <p className="about-team-note">{t('about.team_assistants')}</p>
        </section>

        {/* Technology */}
        <section className="about-section">
          <h2 className="about-section-title">{t('about.tech_title')}</h2>
          <div className="about-tech-tags">
            {['React', 'TypeScript', 'Vite', 'D3.js', 'Leaflet', 'Tailwind CSS', 'Fuse.js', 'react-i18next'].map(tech => (
              <span key={tech} className="about-tech-tag">{tech}</span>
            ))}
          </div>
        </section>

        {/* Citation */}
        <section className="about-section">
          <h2 className="about-section-title">{t('about.cite_title')}</h2>
          <div className="about-cite-block">
            <code>
              Macit, A., Çetinkaya, A. & Gökalp, H. (2026). İTTA: İslam Tarihyazım Tarihi Atlası — Atlas of Islamic Historiography. Selçuk University & Kocaeli University.
            </code>
          </div>
        </section>
      </div>
    </div>
  );
}
