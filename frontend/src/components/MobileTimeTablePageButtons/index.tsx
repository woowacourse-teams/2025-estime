import IChevronLeft from '@/icons/IChevronLeft';
import Flex from '../Layout/Flex';
import PageArrowButton from '../PageArrowButton';
import IChevronRight from '@/icons/IChevronRight';

interface MobileTimeTablePageButtonsProps {
  handlePrev: () => void;
  handleNext: () => void;
  canPrev: boolean;
  canNext: boolean;
}

const MobileTimeTablePageButtons = ({
  handlePrev,
  handleNext,
  canPrev,
  canNext,
}: MobileTimeTablePageButtonsProps) => {
  return (
    <Flex gap="var(--gap-2)" justify="flex-end">
      <PageArrowButton onClick={handlePrev} disabled={!canPrev}>
        <IChevronLeft />
      </PageArrowButton>
      <PageArrowButton onClick={handleNext} disabled={!canNext}>
        <IChevronRight />
      </PageArrowButton>
    </Flex>
  );
};

export default MobileTimeTablePageButtons;
