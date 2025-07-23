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

export interface CreateUserType {
  name: string;
  password: string;
}
export interface CreateUserResponseType {
  code: number;
  success: boolean;
  message: string;
  result: { session: string };
}
