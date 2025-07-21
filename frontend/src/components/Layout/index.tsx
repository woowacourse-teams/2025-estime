import * as S from './Layout.styled';
import Header from './Header';
import { Outlet } from 'react-router';

const Layout = ({ isDark, toggleTheme }: { isDark: boolean; toggleTheme: () => void }) => {
  return (
    <>
      <Header isDark={isDark} toggleTheme={toggleTheme} />
      <S.Container>
        <Outlet />
      </S.Container>
    </>
  );
};

export default Layout;
