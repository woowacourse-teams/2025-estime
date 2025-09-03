import Layout from '@/shared/layout';
import { Route, Routes } from 'react-router';
import CreateEventPage from '../pages/CreateEvent/CreateEventPage';
import CheckEventPage from '../pages/CheckEvent/CheckEventPage';
import CreditsPage from '@/pages/common/CreditsPage';
import Error404Page from '@/pages/common/Error404Page';

const DesktopRoutes = ({ isDark, toggleTheme }: { isDark: boolean; toggleTheme: () => void }) => {
  return (
    <Routes>
      <Route path="/" element={<Layout isDark={isDark} toggleTheme={toggleTheme} />}>
        <Route index element={<CreateEventPage />} />
        <Route path="check" element={<CheckEventPage />} />
        <Route path="credits" element={<CreditsPage />} />
        <Route path="*" element={<Error404Page />} />
      </Route>
    </Routes>
  );
};

export default DesktopRoutes;
