export interface CreateRoomRequestType {
  title: string;
  availableDates: string[];
  startTime: string;
  endTime: string;
  deadLine: string;
  isPublic: boolean;
}

export interface CreateChannelRoomRequestType extends CreateRoomRequestType {
  platform: 'DISCORD' | 'SLACK';
  channelId: string;
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

export type StatisticItem = {
  dateTime: string;
  userNames: string[];
};

export type GetRoomStatisticsResponseType = {
  statistic: StatisticItem[] | [];
};
