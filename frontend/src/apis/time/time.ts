import baseFetch from '../common/baseFetch';
import { baseURL } from '../common/constant';
import {
  CombinedAvailableTimesResponse,
  UserAvailableTimeResponse,
  RecommendationTimeResponse,
  UserAvailableTimeRequest,
} from './type';

export const putUserAvailableTime = async (session: string, body: UserAvailableTimeRequest) => {
  return await baseFetch(`${baseURL}/${session}/time-slots`, 'PUT', undefined, body);
};

export const postUserAvailableTime = async (session: string, body: UserAvailableTimeRequest) => {
  return await baseFetch(`${baseURL}/${session}/time-slots`, 'POST', undefined, body);
};

export const getUserAvailableTime = async (
  session: string,
  name: string
): Promise<UserAvailableTimeResponse> => {
  return await baseFetch(`${baseURL}/${session}/time-slots/user`, 'GET', { name });
};

export const getTimeSlotStatistics = async (
  session: string
): Promise<CombinedAvailableTimesResponse> => {
  return await baseFetch(`${baseURL}/${session}/time-slots/statistic`, 'GET');
};

export const getRecommendedTime = async (session: string): Promise<RecommendationTimeResponse> => {
  return baseFetch(`${baseURL}/${session}/time-slots/recommendation`, 'GET');
};
