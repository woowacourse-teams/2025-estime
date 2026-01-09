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
