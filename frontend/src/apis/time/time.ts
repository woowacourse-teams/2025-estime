import api from '../common';
import { ROOM_API_PATH_V2 } from '../common/constant';
import type {
  UpdateUserAvailableTimeType,
  UserAvailableTimeResponseType,
  UserAvailableTimeRequestType,
} from './type';

export const updateUserAvailableTime = async (
  session: string | null,
  body: UserAvailableTimeRequestType
): Promise<UpdateUserAvailableTimeType> => {
  return await api.put(`${ROOM_API_PATH_V2}/${session}/votes/participants`, body);
};

export const getUserAvailableTime = async (
  session: string,
  name: string
): Promise<UserAvailableTimeResponseType> => {
  return await api.get(`${ROOM_API_PATH_V2}/${session}/votes/participants`, {
    participantName: name,
  });
};
