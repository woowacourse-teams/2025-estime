interface TimeTableCellProps {
  date: string;
  timeText: string;
}

const TimeTableCell = ({ date, timeText }: TimeTableCellProps) => {
  const dateTimeKey = `${date}T${timeText}`;

  return <div className="heat-map-cell" data-time={dateTimeKey} />;
};

export default TimeTableCell;
