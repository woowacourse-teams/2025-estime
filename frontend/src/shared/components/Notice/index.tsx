import * as S from './Notice.styled';

interface ExpiryNoticeProps {
  show: boolean;
  type: 'info' | 'warning' | 'error';
  maxWidth?: string;
  children: React.ReactNode;
}

const Notice = ({ show, children, ...props }: ExpiryNoticeProps) => {
  return (
    <S.Container show={show} {...props}>
      {children}
    </S.Container>
  );
};

export default Notice;
