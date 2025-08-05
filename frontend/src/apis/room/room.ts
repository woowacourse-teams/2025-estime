import api from '../common';
import { CHANNEL_ROOM_API_PATH, ROOM_API_PATH } from '../common/constant';
import type {
  CreateRoomResponseType,
  CreateRoomRequestType,
  GetRoomInfoResponseType,
  CreateUserType,
  CreateUserResponseType,
  CreateChannelRoomRequestType,
} from './type';

export const createRoom = async (body: CreateRoomRequestType): Promise<CreateRoomResponseType> => {
  return await api.post(`${ROOM_API_PATH}`, body);
};

export const createChannelRoom = async (
  body: CreateChannelRoomRequestType
): Promise<CreateRoomResponseType> => {
  return await api.post(`${CHANNEL_ROOM_API_PATH}`, body);
};

export const getRoomInfo = async (sessionId: string): Promise<GetRoomInfoResponseType> => {
  return await api.get(`${ROOM_API_PATH}/${sessionId}`);
};
export const joinUser = async (
  sessionId: string,
  body: CreateUserType
): Promise<CreateUserResponseType> => {
  return await api.post(`${ROOM_API_PATH}/${sessionId}/participants`, body);
};
