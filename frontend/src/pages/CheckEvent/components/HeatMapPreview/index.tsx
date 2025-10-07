import * as S from './HeatmapPreview.styled';
import Wrapper from '@/shared/layout/Wrapper';
import TimeTableDay from '../Timetable/TimeTableDay';
import HeatMapPreviewDataCell from '../Heatmap/HeatMapPreviewDataCell';

interface HeatmapProps {
  dateTimeSlots: string[];
  date: string;
  show: boolean;
}

const HeatmapPreview = ({ date, dateTimeSlots, show }: HeatmapProps) => {
  return (
    <S.Container show={show}>
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
