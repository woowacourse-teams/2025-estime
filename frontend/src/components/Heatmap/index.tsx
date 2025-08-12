import Wrapper from '@/components/Layout/Wrapper';
import Text from '@/components/Text';
import * as S from './Heatmap.styled';

import HeatMapDataCell from './HeatMapDataCell';
import type { DateCellInfo } from '@/hooks/useRoomStatistics';
import TimeTableDay from '@/components/Timetable/TimeTableDay';
import TableTooltip from '../TableTooltip';
import useHeatMapInteraction from '@/hooks/useHeatMapInteraction';

interface HeatmapProps {
  dateTimeSlots: string[];
  availableDates: Set<string>;
  roomStatistics: Map<string, DateCellInfo>;
  interactionMode: 'desktop' | 'mobile';
}

const Heatmap = ({
  dateTimeSlots,
  availableDates,
  roomStatistics,
  interactionMode = 'desktop',
}: HeatmapProps) => {
  const {
    tooltipInfo,
    position,
    handleMouseEnter,
    handleMouseLeave,
    handleMobileClick,
    isClicked,
  } = useHeatMapInteraction(interactionMode);

  return (
    <S.HeatMapContent>
      <S.TimeSlotColumn>
        {dateTimeSlots.map((timeText) => (
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
          <TimeTableDay date={date} key={`${date}-day`} />
          {dateTimeSlots.map((timeText) => (
            <HeatMapDataCell
              key={`${date}T${timeText}`}
              date={date}
              timeText={timeText}
              roomStatistics={roomStatistics}
              onEnter={handleMouseEnter}
              onLeave={handleMouseLeave}
              onMobileClick={handleMobileClick}
              isClicked={isClicked(date, timeText)}
            />
          ))}
        </Wrapper>
      ))}
      {interactionMode === 'desktop' && !!tooltipInfo?.participantList?.length && (
        <TableTooltip
          position={position}
          positioning="mouse-follow"
          participantList={tooltipInfo.participantList}
          date={tooltipInfo.date}
          timeText={tooltipInfo.timeText}
        />
      )}
    </S.HeatMapContent>
  );
};
export default Heatmap;
