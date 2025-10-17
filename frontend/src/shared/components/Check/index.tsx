import { ComponentProps, createContext, useContext } from 'react';
import * as S from './Check.styled';
import ISuccess from '@/assets/icons/ISuccess';
import { LIGHT_THEME } from '@/styles/theme';
import Text from '../Text';

interface BoxProps {
  checked: boolean;
  onChange: (next?: boolean) => void;
  disabled?: boolean;
  color?: keyof typeof LIGHT_THEME.colors;
  size?: 'x-small' | 'small' | 'medium' | 'large';
}

const CheckContext = createContext<{ id: string } | null>(null);

const useCheckContext = () => {
  const context = useContext(CheckContext);
  if (!context) throw new Error('<Check> 컴포넌트 내부에서만 사용가능합니다');
  return context;
};

const Check = ({ id, children }: { id: string; children: React.ReactNode }) => {
  return (
    <CheckContext.Provider value={{ id }}>
      <S.Container>{children}</S.Container>
    </CheckContext.Provider>
  );
};

const Box = ({ checked, onChange, disabled, color = 'primary', size = 'large' }: BoxProps) => {
  const { id } = useCheckContext();

  return (
    <>
      <S.HiddenCheckbox
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
      />
      {/* label을 시각 요소로 사용 → 클릭 시 input 토글 */}
      <S.Visual
        htmlFor={id}
        color={color}
        size={size}
        selected={checked}
        data-disabled={disabled || undefined}
      >
        <ISuccess color={checked ? 'white' : LIGHT_THEME.colors[color]} aria-hidden />
      </S.Visual>
    </>
  );
};

const Label = ({ children, ...props }: ComponentProps<'label'>) => {
  const { id } = useCheckContext();

  return (
    <S.Label htmlFor={id} {...props}>
      <Text variant="h3" color="gray70">
        {children}
      </Text>
    </S.Label>
  );
};

Check.Box = Box;
Check.Label = Label;

export default Check;
