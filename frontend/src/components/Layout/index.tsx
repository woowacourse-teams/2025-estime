import { Outlet } from 'react-router';
import Header from './Header';

const Layout = ({ isDark, toggleTheme }: { isDark: boolean; toggleTheme: () => void }) => {
  return (
    <>
      <Header isDark={isDark} toggleTheme={toggleTheme} />
      <Outlet />
    </>
  );
};

export default Layout;
