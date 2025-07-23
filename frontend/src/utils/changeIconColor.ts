import { ColorsKey, Theme } from '@/styles/theme';
import { useTheme } from '@emotion/react';

const changeIconColor = ({
  defaultColor,
  isSelected,
}: {
  defaultColor: ColorsKey;
  isSelected: boolean;
}) => {
  const { colors } = useTheme();
  return isSelected ? colors.background : colors[defaultColor];
};

export default changeIconColor;
