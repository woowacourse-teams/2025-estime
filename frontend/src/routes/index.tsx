import RootElement from '@/RootElement';
import LoadingSpinner from '@/shared/components/LoadingSpinner';
import { lazy, Suspense } from 'react';
import CreateEventPageSkeleton from '@/pages/CreateEvent/components/Skeleton';
import CheckEventPageSkeleton from '@/pages/CheckEvent/components/Skeleton';
import CreditsPageSkeleton from '@/pages/common/CreditsPageSkeleton';

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
        element: isMobile ? (
          <Suspense fallback={<LoadingSpinner />}>
            <MobileCreateEventPage />
          </Suspense>
        ) : (
          <Suspense fallback={<CreateEventPageSkeleton />}>
            <CreateEventPage />
          </Suspense>
        ),
      },
      {
        path: 'check',
        element: (
          <Suspense fallback={<CheckEventPageSkeleton />}>
            <CheckEventPage />
          </Suspense>
        ),
      },
      {
        path: 'credits',
        element: (
          <Suspense fallback={<CreditsPageSkeleton />}>
            <CreditsPage />
          </Suspense>
        ),
      },
      { path: '*', element: <Error404Page /> },
    ],
  },
];

export default appRoutes;
