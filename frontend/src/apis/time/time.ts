import api from '../common';
import { ROOM_API_PATH } from '../common/constant';
import type {
  CombinedAvailableTimesResponseType,
  UserAvailableTimeResponseType,
  RecommendationTimeResponseType,
  UserAvailableTimeRequestType,
  updateUserAvailableTimeType,
} from './type';

export const updateUserAvailableTime = async (
  session: string | null,
  body: UserAvailableTimeRequestType
): Promise<updateUserAvailableTimeType> => {
  return await api.put(`${ROOM_API_PATH}/${session}/votes/participants`, body);
};

export const createUserAvailableTime = async (
  session: string | null,
  body: UserAvailableTimeRequestType
) => {
  return await api.post(`${ROOM_API_PATH}/${session}/votes/participants`, body);
};

export const getUserAvailableTime = async (
  session: string,
  name: string
): Promise<UserAvailableTimeResponseType> => {
  return await api.get(`${ROOM_API_PATH}/${session}/votes/participants`, { participantName: name });
};

export const getTimeSlotStatistics = async (
  session: string
): Promise<CombinedAvailableTimesResponseType> => {
  return await api.get(`${ROOM_API_PATH}/${session}/statistic/date-slots`);
};

export const getRecommendedTime = async (
  session: string
): Promise<RecommendationTimeResponseType> => {
  return api.get(`${ROOM_API_PATH}/${session}/time-slots/recommendation`);
};
