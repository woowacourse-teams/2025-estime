import * as S from './ExpiryNotice.styled';

interface ExpiryNoticeProps {
  show: boolean;
  children: React.ReactNode;
}

const ExpiryNotice = ({ show, children, ...props }: ExpiryNoticeProps) => {
  console.log(show);
  return (
    <S.Container show={show} {...props}>
      {children}
    </S.Container>
  );
};

export default ExpiryNotice;
