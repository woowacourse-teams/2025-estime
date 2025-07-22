export interface UserAvailableTimeRequest {
  userName: string;
  dateTimes: string[];
}

export type UserAvailableTimeResponse = {
  userName: string;
  timeSlots: string[];
};

export interface CombinedAvailableTimesResponse {
  timeSlots: TimeSlotStat[];
}

export interface RecommendationTimeResponse {
  recommendations: RecommendedTimeSlot[];
}

interface TimeSlotStat {
  startTime: string;
  availableMembers: number;
}

interface RecommendedTimeSlot {
  dateTime: string;
  userNames: string[];
}
