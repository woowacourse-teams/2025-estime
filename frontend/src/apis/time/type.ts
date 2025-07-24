export interface UserAvailableTimeRequestType {
  userName: string;
  dateTimes: string[];
}

export type UserAvailableTimeResponseType = {
  userName: string;
  timeSlots: Record<'userName' | 'dateTime', string>[];
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
