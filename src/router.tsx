import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/layout/Layout';

// Eager load: Dashboard (landing page)
import Dashboard from './pages/Dashboard';

// Lazy load: all other pages for code splitting
const ScholarList = lazy(() => import('./pages/ScholarList'));
const ScholarDetail = lazy(() => import('./pages/ScholarDetail'));
const SourceList = lazy(() => import('./pages/SourceList'));
const SourceDetail = lazy(() => import('./pages/SourceDetail'));
const MapView = lazy(() => import('./pages/MapView'));
const HavzaDetail = lazy(() => import('./pages/HavzaDetail'));
const NetworkView = lazy(() => import('./pages/NetworkView'));
const TimelineView = lazy(() => import('./pages/TimelineView'));
const About = lazy(() => import('./pages/About'));
const Statistics = lazy(() => import('./pages/Statistics'));
const SilsileView = lazy(() => import('./pages/SilsileView'));
const HavzaCompare = lazy(() => import('./pages/HavzaCompare'));

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
    ],
  },
], { basename: import.meta.env.BASE_URL });
