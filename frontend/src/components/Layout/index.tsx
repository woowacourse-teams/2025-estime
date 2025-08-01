import * as S from './Layout.styled';
import Header from './Header';
import { Outlet } from 'react-router';
import ErrorBoundary from '@/ErrorBoundary';
import ErrorPage from '@/pages/ErrorPage';

const Layout = ({ isDark, toggleTheme }: { isDark: boolean; toggleTheme: () => void }) => {
  return (
    <>
      <Header isDark={isDark} toggleTheme={toggleTheme} />
      <ErrorBoundary fallback={<ErrorPage />}>
        <S.Container>
          <Outlet />
        </S.Container>
      </ErrorBoundary>
    </>
  );
};

export default Layout;
