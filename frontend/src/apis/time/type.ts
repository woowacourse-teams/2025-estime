export interface UserAvailableTimeRequestType {
  userName: string;
  dateTimes: string[];
}

type UserAvailableTimeInnerType = {
  userName: string;
  dateTime: string;
};

export type UserAvailableTimeResponseType = {
  dateTimeSlots: UserAvailableTimeInnerType[];
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
