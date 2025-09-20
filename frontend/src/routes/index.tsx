import RootElement from '@/RootElement';
import { lazy } from 'react';

const isMobile = /android|iphone|ipad|ipod|blackberry|opera mini/i.test(navigator.userAgent);

const MobileCreateEventPage = lazy(
  () => import('@/pages/CreateEvent/Mobile/MobileCreateEventPage')
);
const CreateEventPage = lazy(() => import('@/pages/CreateEvent/CreateEventPage'));
const CheckEventPage = lazy(() => import('../pages/CheckEvent/CheckEventPage'));
const CreditsPage = lazy(() => import('@/pages/common/CreditsPage'));
const Error404Page = lazy(() => import('@/pages/common/Error404Page'));

const appRoutes = [
  {
    path: '/',
    element: <RootElement />,
    errorElement: <Error404Page />,
    children: [
      {
        index: true,
        element: isMobile ? <MobileCreateEventPage /> : <CreateEventPage />,
      },
      { path: 'check', element: <CheckEventPage /> },
      { path: 'credits', element: <CreditsPage /> },
      { path: '*', element: <Error404Page /> },
    ],
  },
];

export default appRoutes;
