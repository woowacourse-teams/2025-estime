import * as S from './MiniPopup.styled';

const MiniPopup = ({ children }: { children: React.ReactNode }) => {
  return <S.Container>{children}</S.Container>;
};

export default MiniPopup;
