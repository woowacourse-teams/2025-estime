import Wrapper from '@/components/Layout/Wrapper';
import Text from '@/components/Text';
import * as S from './Heatmap.styled';

import HeatMapDataCell from './HeatMapDataCell';
import type { DateCellInfo } from '@/hooks/useRoomStatistics';
import TimeTableDay from '@/components/Timetable/TimeTableDay';
import { useCallback, useState } from 'react';
import TableTooltip from '../TableTooltip';
import { useHoverTooltip } from '@/hooks/useHoverTooltip';

interface HeatmapProps {
  dateTimeSlots: string[];
  availableDates: Set<string>;
  roomStatistics: Map<string, DateCellInfo>;
  isMobile: boolean;
}
export interface TooltipInfo {
  date: string;
  timeText: string;
  participantList: string[];
}
const Heatmap = ({
  dateTimeSlots,
  availableDates,
  roomStatistics,
  isMobile = true,
}: HeatmapProps) => {
  const [tooltipInfo, setTooltipInfo] = useState<TooltipInfo | null>(null);

  const { position, onEnter, onLeave } = useHoverTooltip(isMobile);

  const handleMouseEnter = (tooltipInfo: TooltipInfo, event: React.PointerEvent) => {
    if (isMobile) return;
    setTooltipInfo(tooltipInfo);
    onEnter(event);
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    setTooltipInfo(null);
    onLeave();
  };

  // 모바일 클릭 핸들러
  const handleMobileClick = useCallback(
    (tooltipInfo: TooltipInfo) => {
      if (!isMobile) return;
      setTooltipInfo(tooltipInfo);
    },
    [isMobile]
  );

  const isClicked = (date: string, timeText: string) => {
    return (
      isMobile &&
      tooltipInfo?.date === date &&
      tooltipInfo?.timeText === timeText &&
      !!tooltipInfo.participantList.length
    );
  };
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
      {!isMobile && !!tooltipInfo?.participantList?.length && (
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
