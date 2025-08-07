import Wrapper from '@/components/Layout/Wrapper';
import Text from '@/components/Text';
import * as S from './Heatmap.styled';

import HeatMapDataCell from './HeatMapDataCell';
import type { DateCellInfo } from '@/hooks/useRoomStatistics';
import TimeTableDay from '@/components/Timetable/TimeTableDay';
import { useState } from 'react';
import TableTooltip from '../TableTooltip';
import Flex from '../Layout/Flex';
import IPerson from '@/icons/IPerson';
import { useHoverTooltip } from '@/hooks/useHoverTooltip';
interface HeatmapProps {
  dateTimeSlots: string[];
  availableDates: Set<string>;
  roomStatistics: Map<string, DateCellInfo>;
}
export interface TooltipInfo {
  date: string;
  timeText: string;
  participantList: string[];
}
const Heatmap = ({ dateTimeSlots, availableDates, roomStatistics }: HeatmapProps) => {
  const [tooltipInfo, setTooltipInfo] = useState<TooltipInfo | null>(null);

  const { position, onEnter, onLeave } = useHoverTooltip();

  const handleMouseEnter = (tooltipInfo: TooltipInfo, event: React.PointerEvent) => {
    setTooltipInfo(tooltipInfo);
    onEnter(event);
  };

  const handleMouseLeave = () => {
    setTooltipInfo(null);
    onLeave();
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
            />
          ))}
        </Wrapper>
      ))}
      {!!tooltipInfo?.participantList?.length && (
        <TableTooltip position={position}>
          <Flex direction="row" gap="var(--gap-4)" align="center">
            <IPerson />
            <Text variant="body" color="text">
              {tooltipInfo.participantList.join(', ')} 참여 가능!
            </Text>
          </Flex>
        </TableTooltip>
      )}
    </S.HeatMapContent>
  );
};
export default Heatmap;
