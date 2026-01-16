import api from '../common';
import { ROOM_API_PATH, ROOM_API_PATH_V2 } from '../common/constant';
import type {
  UserAvailableTimeResponseType,
  UserAvailableTimeRequestType,
  updateUserAvailableTimeType,
} from './type';

export const updateUserAvailableTime = async (
  session: string | null,
  body: UserAvailableTimeRequestType
): Promise<updateUserAvailableTimeType> => {
  return await api.put(`${ROOM_API_PATH}/${session}/votes/participants`, body);
};

export const getUserAvailableTime = async (
  session: string,
  name: string
): Promise<UserAvailableTimeResponseType> => {
  return await api.get(`${ROOM_API_PATH}/${session}/votes/participants`, { participantName: name });
};

export const getUserAvailableTime2 = async (
  session: string,
  name: string
): Promise<UserAvailableTimeResponseType> => {
  return await api.get(`${ROOM_API_PATH_V2}/${session}/votes/participants`, {
    participantName: name,
  });
};
