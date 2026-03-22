import { lazy, Suspense, type ComponentType } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/layout/Layout';

// Eager load: Dashboard (landing page)
import Dashboard from './pages/Dashboard';

/**
 * Retry wrapper for dynamic imports.
 * When a chunk fails to load (stale hash after deploy), reload once to get fresh assets.
 * Prevents the "Failed to fetch dynamically imported module" error.
 */
function lazyRetry(factory: () => Promise<{ default: ComponentType<unknown> }>) {
  return lazy(() =>
    factory().catch((err) => {
      // Only reload once per session to avoid infinite loops
      const reloadKey = 'itta-chunk-reload';
      const hasReloaded = sessionStorage.getItem(reloadKey);
      if (!hasReloaded) {
        sessionStorage.setItem(reloadKey, '1');
        window.location.reload();
        // Return a dummy component while reloading
        return { default: () => null } as { default: ComponentType<unknown> };
      }
      // If already reloaded and still failing, propagate the error
      throw err;
    })
  );
}

// Lazy load with retry: all other pages for code splitting
const ScholarList = lazyRetry(() => import('./pages/ScholarList'));
const ScholarDetail = lazyRetry(() => import('./pages/ScholarDetail'));
const SourceList = lazyRetry(() => import('./pages/SourceList'));
const SourceDetail = lazyRetry(() => import('./pages/SourceDetail'));
const MapView = lazyRetry(() => import('./pages/MapView'));
const HavzaDetail = lazyRetry(() => import('./pages/HavzaDetail'));
const NetworkView = lazyRetry(() => import('./pages/NetworkView'));
const TimelineView = lazyRetry(() => import('./pages/TimelineView'));
const About = lazyRetry(() => import('./pages/About'));
const Statistics = lazyRetry(() => import('./pages/Statistics'));
const SilsileView = lazyRetry(() => import('./pages/SilsileView'));
const HavzaCompare = lazyRetry(() => import('./pages/HavzaCompare'));
const Periodization = lazyRetry(() => import('./pages/Periodization'));
const Historiography = lazyRetry(() => import('./pages/Historiography'));
const HistoriographyDetail = lazyRetry(() => import('./pages/HistoriographyDetail'));

function SuspenseWrap({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="loading-screen"><span className="loading-spinner" /></div>}>
      {children}
    </Suspense>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'scholars', element: <SuspenseWrap><ScholarList /></SuspenseWrap> },
      { path: 'scholars/:id', element: <SuspenseWrap><ScholarDetail /></SuspenseWrap> },
      { path: 'sources', element: <SuspenseWrap><SourceList /></SuspenseWrap> },
      { path: 'sources/:id', element: <SuspenseWrap><SourceDetail /></SuspenseWrap> },
      { path: 'map', element: <SuspenseWrap><MapView /></SuspenseWrap> },
      { path: 'havza/:id', element: <SuspenseWrap><HavzaDetail /></SuspenseWrap> },
      { path: 'network', element: <SuspenseWrap><NetworkView /></SuspenseWrap> },
      { path: 'timeline', element: <SuspenseWrap><TimelineView /></SuspenseWrap> },
      { path: 'about', element: <SuspenseWrap><About /></SuspenseWrap> },
      { path: 'statistics', element: <SuspenseWrap><Statistics /></SuspenseWrap> },
      { path: 'silsile', element: <SuspenseWrap><SilsileView /></SuspenseWrap> },
      { path: 'compare', element: <SuspenseWrap><HavzaCompare /></SuspenseWrap> },
      { path: 'periodization', element: <SuspenseWrap><Periodization /></SuspenseWrap> },
      { path: 'historiography', element: <SuspenseWrap><Historiography /></SuspenseWrap> },
      { path: 'historiography/:id', element: <SuspenseWrap><HistoriographyDetail /></SuspenseWrap> },
    ],
  },
], { basename: import.meta.env.BASE_URL });
