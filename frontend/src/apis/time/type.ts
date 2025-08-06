export interface UserAvailableTimeRequestType {
  participantName: string;
  dateTimeSlots: string[];
}

export type UserAvailableTimeResponseType = {
  participantName: string;
  dateTimeSlots: string[];
};

export interface CombinedAvailableTimesResponseType {
  timeSlots: TimeSlotStatType[];
}

export interface RecommendationTimeResponseType {
  recommendations: RecommendedTimeSlotType[];
}

export interface TimeSlotStatType {
  startTime: string;
  availableMembers: number;
}

export interface RecommendedTimeSlotType {
  dateTime: string;
  userNames: string[];
}
export interface updateUserAvailableTimeType {
  message: string;
}
