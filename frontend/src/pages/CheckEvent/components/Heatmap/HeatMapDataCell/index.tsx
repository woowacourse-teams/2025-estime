import { getHeatMapCellBackgroundColor } from '@/pages/CheckEvent/utils/getCellColor';
import { useTheme } from '@emotion/react';
import * as S from './HeatMapDataCell.styled';
import type { DateCellInfo } from '@/pages/CheckEvent/hooks/useHeatmapStatistics';
import { FormatManager } from '@/shared/utils/common/FormatManager';
import Flex from '@/shared/layout/Flex';
import Text from '@/shared/components/Text';
import IPerson from '@/assets/icons/IPerson';

interface HeatMapDataCellProps {
  date: string;
  timeText: string;
  roomStatistics: Map<string, DateCellInfo>;
}

const HeatMapDataCell = ({ date, timeText, roomStatistics }: HeatMapDataCellProps) => {
  const theme = useTheme();
  const cellInfo = roomStatistics.get(`${date}T${timeText}`);

  const weight = cellInfo?.weight ?? 0;
  const participantList = cellInfo?.participantNames ?? [];

  const backgroundColor = getHeatMapCellBackgroundColor({
    theme,
    weight,
  });

  const { currentTime, nextTime } = FormatManager.formatAvailableTimeRange(date, timeText);
  const hasParticipants = participantList.length > 0;

  return (
    <S.Container data-heatmap-cell backgroundColor={backgroundColor} hasTooltip={hasParticipants}>
      {hasParticipants && (
        <S.Tooltip>
          <Flex direction="column" gap="var(--gap-6)" align="center" justify="center">
            <Flex direction="column" gap="var(--gap-2)" align="center" justify="center">
              <Text variant="caption" color="text">
                {currentTime}
              </Text>
              <Text variant="caption" color="text">
                ~
              </Text>
              <Text variant="caption" color="text">
                {nextTime}
              </Text>
            </Flex>
            <S.ParticipantGrid participants={participantList.length}>
              {participantList.map((participant) => (
                <S.Person key={participant}>
                  <IPerson />
                  <Text variant="caption" color="text">
                    {participant}
                  </Text>
                </S.Person>
              ))}
            </S.ParticipantGrid>
          </Flex>
        </S.Tooltip>
      )}
    </S.Container>
  );
};

export default HeatMapDataCell;
