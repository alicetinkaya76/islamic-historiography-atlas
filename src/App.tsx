import { RouterProvider } from 'react-router-dom';
import { useDirection } from './hooks/useDirection';
import { router } from './router';
import { ToastProvider } from './components/ui/Toast';
import './i18n';

export default function App() {
  const dir = useDirection();

  return (
    <div dir={dir} className={dir === 'rtl' ? 'app-rtl' : 'app-ltr'}>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </div>
  );
}
