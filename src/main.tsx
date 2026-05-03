import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ToastContainer } from 'react-toastify';
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router';

import App from './app';
import { routesSection } from './routes/sections';
import { ErrorBoundary } from './routes/components';

// ----------------------------------------------------------------------

const router = createBrowserRouter([
  {
    Component: () => (
      <App>
        <Outlet />
        <ToastContainer aria-label="toast" limit={3} />
      </App>
    ),
    errorElement: <ErrorBoundary />,
    children: routesSection,
  },
]);

const root = createRoot(document.getElementById('root')!);

root.render(
  // <StrictMode>
  <RouterProvider router={router} />
  // </StrictMode>
);
