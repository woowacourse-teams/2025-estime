export interface RoomInfo {
  title: string;
  availableDateSlots: Set<string>;
  deadline: { date: string; time: string };
}
