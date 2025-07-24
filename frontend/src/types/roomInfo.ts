export interface RoomInfo {
  title: string;
  availableDates: Set<string>;
  time: { startTime: string; endTime: string };
  deadLine: { date: string; time: string };
  isPublic: 'public' | 'private';
}
