import * as S from './Layout.styled';
import Header from './Header';
import { Outlet } from 'react-router';
import ErrorBoundary from '@/providers/ErrorBoundary';
import ErrorPage from '@/pages/common/ErrorPage';
import ToastProvider from '@/providers/ToastProvider';
import Footer from './Footer';
import { useTheme } from '@emotion/react';

const Layout = ({ isDark, toggleTheme }: { isDark: boolean; toggleTheme: () => void }) => {
  const { isMobile } = useTheme();

  return (
    <>
      <Header isDark={isDark} toggleTheme={toggleTheme} />
      <ToastProvider>
        <ErrorBoundary fallback={<ErrorPage />}>
          <S.Container>
            <Outlet />
          </S.Container>
        </ErrorBoundary>
      </ToastProvider>
      {!isMobile && <Footer />}
    </>
  );
};

export default Layout;
