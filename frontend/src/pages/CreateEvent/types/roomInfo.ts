export interface RoomInfo {
  title: string;
  availableDateSlots: Set<string>;
  deadline: { date: string; time: string };
}
export interface CreateRoomInfoType extends RoomInfo {
  time: { startTime: string; endTime: string };
}
