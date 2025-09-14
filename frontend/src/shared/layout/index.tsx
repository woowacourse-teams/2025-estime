import * as S from './Layout.styled';
import Header from './Header';
import { Outlet } from 'react-router';
import ErrorBoundary from '@/providers/ErrorBoundary';
import ErrorPage from '@/pages/common/ErrorPage';
import ToastProvider from '@/providers/ToastProvider';
import Footer from './Footer';
import { useTheme } from '@emotion/react';
import { Suspense } from 'react';

const Layout = ({ isDark, toggleTheme }: { isDark: boolean; toggleTheme: () => void }) => {
  const { isMobile } = useTheme();

  return (
    <>
      <Header isDark={isDark} toggleTheme={toggleTheme} />
      <ToastProvider>
        <ErrorBoundary fallback={<ErrorPage />}>
          <S.Container>
            <Suspense fallback={<span>...loading</span>}>
              <Outlet />
            </Suspense>
          </S.Container>
        </ErrorBoundary>
      </ToastProvider>
      {!isMobile && <Footer />}
    </>
  );
};

export default Layout;
