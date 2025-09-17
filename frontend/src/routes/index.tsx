import CheckEventPage from '@/pages/CheckEvent/CheckEventPage';
import CreditsPage from '@/pages/common/CreditsPage';
import Error404Page from '@/pages/common/Error404Page';
import CreateEventPage from '@/pages/CreateEvent/CreateEventPage';
import MobileCreateEventPage from '@/pages/CreateEvent/Mobile/MobileCreateEventPage';
import RootElement from '@/RootElement';

const appRoutes = [
  {
    path: '/',
    element: <RootElement />,
    errorElement: <Error404Page />,
    children: [
      {
        index: true,
        element: (() => {
          const isMobile = /android|iphone|ipad|ipod|blackberry|opera mini/i.test(
            navigator.userAgent
          );

          return isMobile ? <MobileCreateEventPage /> : <CreateEventPage />;
        })(),
      },
      { path: 'check', element: <CheckEventPage /> },
      { path: 'credits', element: <CreditsPage /> },
      { path: '*', element: <Error404Page /> },
    ],
  },
];

export default appRoutes;
