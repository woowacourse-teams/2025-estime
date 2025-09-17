import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';
import appRoutes from './routes';
import * as Sentry from '@sentry/react';
import GTM from '@/libs/trackers/GTM';
import '@/styles/index.css';

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    sendDefaultPii: true,
  });

  GTM.init({ gtmId: 'GTM-5G2XCWPL' });
}

const root = ReactDOM.createRoot(document.getElementById('root')!);
const router = createBrowserRouter(appRoutes);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />;
  </React.StrictMode>
);
