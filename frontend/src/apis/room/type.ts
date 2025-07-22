export interface CreateRoomRequest {
  title: string;
  availableDates: string[];
  startTime: string;
  endTime: string;
}

export interface CreateRoomResponse {
  session: string;
}

export interface GetRoomInfoResponse {
  title: string;
  availableDates: string[];
  startTime: string;
  endTime: string;
  deadLine: string;
  isPublic: boolean;
  roomSession: string;
}
