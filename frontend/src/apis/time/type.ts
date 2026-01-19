export interface UserAvailableTimeRequestType {
  participantName: string;
  dateTimeSlots: string[];
}

export type UserAvailableTimeResponseType = {
  participantName: string;
  dateTimeSlots: string[];
};

export interface updateUserAvailableTimeType {
  message: string;
}

export interface UserAvailableTime2RequestType {
  participantName: string;
  slotCodes: number[];
}

export type UserAvailableTime2ResponseType = {
  slotCodes: number[];
};

export interface updateUserAvailableTimeType {
  slotCodes: number[];
}
