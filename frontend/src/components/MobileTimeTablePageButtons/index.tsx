import IChevronLeft from '@/icons/IChevronLeft';
import Flex from '../Layout/Flex';
import PageArrowButton from '../PageArrowButton';
import IChevronRight from '@/icons/IChevronRight';
import Text from '../Text';
interface MobileTimeTablePageButtonsProps {
  totalPage: number;
  currentPage: number;
  handlePrev: () => void;
  handleNext: () => void;
  canPrev: boolean;
  canNext: boolean;
}

const MobileTimeTablePageButtons = ({
  totalPage,
  currentPage,
  handlePrev,
  handleNext,
  canPrev,
  canNext,
}: MobileTimeTablePageButtonsProps) => {
  return (
    <Flex gap="var(--gap-3)" justify="flex-end" align="center">
      <PageArrowButton onClick={handlePrev} disabled={!canPrev}>
        <IChevronLeft />
      </PageArrowButton>
      <Text variant="h4">
        {currentPage} / {totalPage}
      </Text>
      <PageArrowButton onClick={handleNext} disabled={!canNext}>
        <IChevronRight />
      </PageArrowButton>
    </Flex>
  );
};

export default MobileTimeTablePageButtons;
