export interface CreateRoomRequestType {
  title: string;
  availableDates: string[];
  startTime: string;
  endTime: string;
  deadLine: string;
  isPublic: boolean;
}

export interface CreateRoomResponseType {
  session: string;
}

export interface GetRoomInfoResponseType {
  title: string;
  availableDates: string[];
  startTime: string;
  endTime: string;
  deadLine: string;
  isPublic: boolean;
  roomSession: string;
}

export interface GetRoomInfoResponseType extends CreateRoomRequestType {
  roomSession: string;
}
