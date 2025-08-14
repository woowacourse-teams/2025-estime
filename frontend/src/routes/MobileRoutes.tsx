import Layout from '@/components/Layout';
import { Route, Routes } from 'react-router';
import CheckEventPage from '../pages/CheckEventPage';
import MobileCreateEventPage from '@/pages/Mobile/MobileCreateEventPage';
import CreditsPage from '@/pages/CreditsPage';
import Error404Page from '@/pages/404Page';

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
