import { createPortal } from 'react-dom';
import * as S from './TableTooltip.styled';
import Text from '@/components/Text';

interface TableTooltipProps {
  content: string;
  position: { x: number; y: number };
}

function TableTooltip({ content, position }: TableTooltipProps) {
  return createPortal(
    <S.Container x={position.x} y={position.y}>
      <Text variant="body" color="text">
        {content}
      </Text>
    </S.Container>,
    // 모달과 동일하게, position 안꼬일려면 이게 좋아용.
    document.body
  );
}

export default TableTooltip;
