import Layout from '@/shared/layout';
import { Route, Routes } from 'react-router';
import { lazy } from 'react';

const CheckEventPage = lazy(() => import('../pages/CheckEvent/CheckEventPage'));
const MobileCreateEventPage = lazy(
  () => import('@/pages/CreateEvent/Mobile/MobileCreateEventPage')
);
const CreditsPage = lazy(() => import('@/pages/common/CreditsPage'));
const Error404Page = lazy(() => import('@/pages/common/Error404Page'));

const MobileRoutes = ({ isDark, toggleTheme }: { isDark: boolean; toggleTheme: () => void }) => {
  return (
    <Routes>
      <Route path="/" element={<Layout isDark={isDark} toggleTheme={toggleTheme} />}>
        <Route index element={<MobileCreateEventPage />} />
        <Route path="check" element={<CheckEventPage />} />
        <Route path="credits" element={<CreditsPage />} />
        <Route path="*" element={<Error404Page />} />
      </Route>
    </Routes>
  );
};

export default MobileRoutes;
