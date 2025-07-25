import * as S from './MiniPopup.styled';

interface MiniPopupProps {
  children: React.ReactNode;
  isVisible: boolean;
}

const MiniPopup = ({ children, isVisible }: MiniPopupProps) => {
  return <S.Container isVisible={isVisible}>{children}</S.Container>;
};

export default MiniPopup;
