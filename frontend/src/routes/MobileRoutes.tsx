import Layout from '@/components/Layout';
import { Route, Routes } from 'react-router';
import CheckEventPage from '../pages/CheckEventPage';
import MobileCreateEventPage from '@/pages/Mobile/MobileCreateEventPage';

const MobileRoutes = ({ isDark, toggleTheme }: { isDark: boolean; toggleTheme: () => void }) => {
  return (
    <Routes>
      <Route path="/" element={<Layout isDark={isDark} toggleTheme={toggleTheme} />}>
        <Route index element={<MobileCreateEventPage />} />
        <Route path="check" element={<CheckEventPage />} />
      </Route>
    </Routes>
  );
};

export default MobileRoutes;
