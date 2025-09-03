import Layout from '@/shared/layout';
import { Route, Routes } from 'react-router';
import CheckEventPage from '../pages/CheckEvent/CheckEventPage';
import MobileCreateEventPage from '@/pages/CreateEvent/Mobile/MobileCreateEventPage';
import CreditsPage from '@/pages/common/CreditsPage';
import Error404Page from '@/pages/common/Error404Page';

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
