import Layout from '@/components/Layout';
import { Route, Routes } from 'react-router';
import CreateEventPage from '../pages/CreateEventPage';
import CheckEventPage from '../pages/CheckEventPage';

const DesktopRoutes = ({ isDark, toggleTheme }: { isDark: boolean; toggleTheme: () => void }) => {
  return (
    <Routes>
      <Route path="/" element={<Layout isDark={isDark} toggleTheme={toggleTheme} />}>
        <Route index element={<CreateEventPage />} />
        <Route path="check" element={<CheckEventPage />} />
      </Route>
    </Routes>
  );
};

export default DesktopRoutes;
