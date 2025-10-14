import * as S from './HeatmapPreview.styled';
import Wrapper from '@/shared/layout/Wrapper';
import TimeTableDay from '../Timetable/TimeTableDay';
import HeatMapPreviewDataCell from '../Heatmap/HeatMapPreviewDataCell';
import { useGlassPreview } from '@/pages/CheckEvent/stores/glassPreviewStore';

interface HeatmapProps {
  dateTimeSlots: string[];
  date: string;
}

const HeatmapPreview = ({ date, dateTimeSlots }: HeatmapProps) => {
  const { isPreviewOn } = useGlassPreview();
  return (
    <S.Container show={isPreviewOn}>
      <Wrapper center={false} maxWidth="100%">
        <TimeTableDay date={date} />
        {dateTimeSlots.map((dateTimeSlot) => (
          <HeatMapPreviewDataCell
            key={`${date}T${dateTimeSlot}`}
            date={date}
            timeText={dateTimeSlot}
          />
        ))}
      </Wrapper>
    </S.Container>
  );
};

export default HeatmapPreview;
