import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Fuse from 'fuse.js';
import { useAuthors, useWorks, type Author, type Work } from '../../hooks/useData';
import { HAVZA_COLORS, TYPE_COLORS } from '../../utils/colors';

type ResultItem =
  | { kind: 'scholar'; data: Author }
  | { kind: 'source'; data: Work };

export default function GlobalSearch() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { authors } = useAuthors();
  const { works } = useWorks();

  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const fuseScholars = useMemo(
    () => new Fuse(authors, { keys: ['meshur_isim', 'tam_isim', 'sehir', 'kimlik', 'arabic_name'], threshold: 0.35, includeScore: true }),
    [authors]
  );

  const fuseSources = useMemo(
    () => new Fuse(works, { keys: ['eser_adi', 'hanedan', 'yazilma_sehri'], threshold: 0.35, includeScore: true }),
    [works]
  );

  const results: ResultItem[] = useMemo(() => {
    if (!query.trim()) return [];
    const scholars = fuseScholars.search(query, { limit: 5 }).map(r => ({ kind: 'scholar' as const, data: r.item, score: r.score || 1 }));
    const sources = fuseSources.search(query, { limit: 5 }).map(r => ({ kind: 'source' as const, data: r.item, score: r.score || 1 }));
    const merged = [...scholars, ...sources].sort((a, b) => a.score - b.score);
    return merged.slice(0, 8).map(({ kind, data }) => ({ kind, data } as ResultItem));
  }, [query, fuseScholars, fuseSources]);

  const goTo = useCallback((item: ResultItem) => {
    if (item.kind === 'scholar') navigate(`/scholars/${item.data.author_id}`);
    else navigate(`/sources/${(item.data as Work).work_id}`);
    setQuery('');
    setOpen(false);
  }, [navigate]);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Keyboard navigation
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIdx(i => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIdx(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && selectedIdx >= 0 && results[selectedIdx]) {
      e.preventDefault();
      goTo(results[selectedIdx]);
    } else if (e.key === 'Escape') {
      setOpen(false);
      inputRef.current?.blur();
    }
  }

  return (
    <div className="global-search" ref={wrapRef}>
      <div className="gs-input-wrap">
        <svg className="gs-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="8.5" cy="8.5" r="5.5" /><line x1="13" y1="13" x2="18" y2="18" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          className="gs-input"
          placeholder={t('nav.search_placeholder')}
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true); setSelectedIdx(-1); }}
          onFocus={() => query.trim() && setOpen(true)}
          onKeyDown={handleKeyDown}
        />
        {query && (
          <button className="gs-clear" onClick={() => { setQuery(''); setOpen(false); }}>×</button>
        )}
      </div>

      {open && results.length > 0 && (
        <div className="gs-dropdown">
          {results.map((item, i) => (
            <button
              key={`${item.kind}-${item.kind === 'scholar' ? item.data.author_id : (item.data as Work).work_id}`}
              className={`gs-result ${i === selectedIdx ? 'gs-result-active' : ''}`}
              onClick={() => goTo(item)}
              onMouseEnter={() => setSelectedIdx(i)}
            >
              {item.kind === 'scholar' ? (
                <>
                  <span className="gs-dot" style={{ background: HAVZA_COLORS[(item.data as Author).havza] }} />
                  <div className="gs-result-info">
                    <span className="gs-result-name">{(item.data as Author).meshur_isim}</span>
                    <span className="gs-result-meta">
                      {t('stats.scholars')} · {t(`havza_names.${(item.data as Author).havza}`)}
                      {(item.data as Author).vefat_yili_m ? ` · ö. ${(item.data as Author).vefat_yili_m}` : ''}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <span className="gs-dot" style={{ background: TYPE_COLORS[(item.data as Work).eser_turu] || '#999' }} />
                  <div className="gs-result-info">
                    <span className="gs-result-name">{(item.data as Work).eser_adi}</span>
                    <span className="gs-result-meta">
                      {t('stats.sources')} · {t(`source_types.${(item.data as Work).eser_turu}`)}
                    </span>
                  </div>
                </>
              )}
            </button>
          ))}
        </div>
      )}

      {open && query.trim() && results.length === 0 && (
        <div className="gs-dropdown">
          <div className="gs-empty">{t('common.no_results')}</div>
        </div>
      )}
    </div>
  );
}
