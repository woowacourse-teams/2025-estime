import * as S from './Layout.styled';
import Header from './Header';
import { Outlet } from 'react-router';
import Footer from './Footer';
import { useTheme } from '@emotion/react';

const Layout = ({ isDark, toggleTheme }: { isDark: boolean; toggleTheme: () => void }) => {
  const { isMobile } = useTheme();

  return (
    <>
      <Header isDark={isDark} toggleTheme={toggleTheme} />
      <S.Container>
        <Outlet />
      </S.Container>
      {!isMobile && <Footer />}
    </>
  );
};

export default Layout;
