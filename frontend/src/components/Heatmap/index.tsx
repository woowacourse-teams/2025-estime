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
        <Wrapper key={date} center={false} maxWidth="100%">
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
  );
};
export default Heatmap;
