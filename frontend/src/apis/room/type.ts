export interface CreateRoomRequestType {
  title: string;
  availableDateSlots: string[];
  availableTimeSlots: string[];
  deadline: string;
}

export interface CreateChannelRoomRequestType extends CreateRoomRequestType {
  platformType: 'DISCORD' | 'SLACK';
  channelId: string;
  notification: {
    created: boolean;
    remind: boolean;
    deadline: boolean;
  };
}

export interface CreateRoomRequestTypeV3 {
  title: string;
  availableSlots: number[];
  deadline: string;
}

export interface CreateChannelRoomRequestTypeV3 extends CreateRoomRequestTypeV3 {
  platformType: 'DISCORD' | 'SLACK';
  channelId: string;
  notification: {
    created: boolean;
    remind: boolean;
    deadline: boolean;
  };
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
export interface GetRoomInfoResponseTypeV3 {
  title: string;
  availableSlots: number[];
  deadline: string;
  roomSession: string;
}

export interface CreateUserRequestType {
  participantName: string;
}
export interface CreateUserResponseType {
  isDuplicateName: boolean;
}

export type StatisticItem = {
  slotCode: number;
  voteCount: number;
  weight: number;
  participantNames: string[];
};

export type GetRoomStatisticsResponseType = {
  participantCount: number;
  participants: string[];
  maxVoteCount: number;
  statistics: StatisticItem[] | [];
};
