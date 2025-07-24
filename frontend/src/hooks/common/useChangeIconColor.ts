import { ColorsKey } from '@/styles/theme';
import { useTheme } from '@emotion/react';

const useChangeIconColor = ({
  defaultColor,
  isSelected,
}: {
  defaultColor: ColorsKey;
  isSelected: boolean;
}) => {
  const { colors } = useTheme();
  return isSelected ? colors.background : colors[defaultColor];
};

export default useChangeIconColor;
