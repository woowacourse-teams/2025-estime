import RootElement from '@/RootElement';
import LoadingSpinner from '@/shared/components/Spinner';
import { lazy, Suspense } from 'react';
import CreateEventPageSkeleton from '@/pages/CreateEvent/components/Skeleton';
import VotePageSkeleton from '@/pages/Vote/components/Skeleton';
import CreditsPageSkeleton from '@/pages/common/CreditsPageSkeleton';
import AnnounceProvider from '@/shared/contexts/AnnounceContext';

const isMobile = /android|iphone|ipad|ipod|blackberry|opera mini/i.test(navigator.userAgent);

const MobileCreateEventPage = lazy(
  () => import('@/pages/CreateEvent/Mobile/MobileCreateEventPage')
);
const CreateEventPage = lazy(() => import('@/pages/CreateEvent/CreateEventPage'));
const VotePage = lazy(() => import('../pages/Vote/VotePage'));
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
        path: 'vote',
        element: (
          <Suspense fallback={<VotePageSkeleton />}>
            <AnnounceProvider>
              <VotePage />
            </AnnounceProvider>
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
