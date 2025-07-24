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
export interface CreateUserType {
  name: string;
  password: string;
}
export interface CreateUserResponseType {
  name: string;
}
