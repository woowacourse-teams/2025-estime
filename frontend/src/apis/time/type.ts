export interface UserAvailableTimeRequestType {
  participantName: string;
  slotCodes: number[];
}

export type UserAvailableTimeResponseType = {
  slotCodes: number[];
};

export interface UpdateUserAvailableTimeType {
  slotCodes: number[];
}
