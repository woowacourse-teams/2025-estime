export interface CreateRoomRequestType {
  title: string;
  availableDateSlots: string[];
  availableTimeSlots: string[];
  deadline: string;
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
  availableDateSlots: string[];
  availableTimeSlots: string[];
  deadline: string;
  roomSession: string;
}
export interface CreateUserType {
  participantName: string;
}
export interface CreateUserResponseType {
  participantName: string;
}

export type StatisticItem = {
  dateTime: string;
  userNames: string[];
};

export type GetRoomStatisticsResponseType = {
  statistic: StatisticItem[] | [];
};
