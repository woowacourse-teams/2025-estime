import Flex from '@/components/Layout/Flex';
import Wrapper from '@/components/Layout/Wrapper';
import Text from '@/components/Text';
import * as S from './Heatmap.styled';
import HeatMapCell from './HeatMapCell';
import type { DateCellInfo } from '@/hooks/useRoomStatistics';
interface HeatmapProps {
  dateTimeSlots: string[];
  availableDates: Set<string>;
  roomStatistics: Map<string, DateCellInfo>;
}
const Heatmap = ({ dateTimeSlots, availableDates, roomStatistics }: HeatmapProps) => {
  const timeList = ['Dates', ...dateTimeSlots];

  return (
    <Flex direction="column" gap="var(--gap-6)">
      <S.HeatMapContent>
        <S.TimeSlotColumn>
          {timeList.map((timeText) => (
            <S.GridContainer key={timeText}>
              {timeText.endsWith(':00') && (
                <S.TimeLabel>
                  <Text variant="body" color="text">
                    {timeText}
                  </Text>
                </S.TimeLabel>
              )}
            </S.GridContainer>
          ))}
        </S.TimeSlotColumn>
        {[...availableDates].map((date) => (
          <Wrapper key={date} center={false}>
            {timeList.map((timeText) => (
              <HeatMapCell
                key={`${date}T${timeText}`}
                date={date}
                timeText={timeText}
                roomStatistics={roomStatistics}
              />
            ))}
          </Wrapper>
        ))}
      </S.HeatMapContent>
    </Flex>
  );
};
export default Heatmap;
