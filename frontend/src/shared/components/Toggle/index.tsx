import * as S from './Toggle.styled';

interface toggleProps {
  isOn: boolean;
  onToggle: () => void;
}

const Toggle = ({ isOn, onToggle }: toggleProps) => {
  return (
    <S.Container onClick={onToggle} isOn={isOn}>
      <S.Track isOn={isOn}>
        <S.Thumb />
      </S.Track>
    </S.Container>
  );
};

export default Toggle;
