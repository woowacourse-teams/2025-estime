import api from '../common';
import { ROOM_API_PATH } from '../common/constant';
import { CreateRoomResponseType, CreateRoomRequestType, GetRoomInfoResponseType } from './type';

export const createRoom = async (body: CreateRoomRequestType): Promise<CreateRoomResponseType> => {
  return await api.post(`${ROOM_API_PATH}`, body);
};

export const getRoomInfo = async (sessionId: string): Promise<GetRoomInfoResponseType> => {
  return await api.get(`${ROOM_API_PATH}/${sessionId}`);
};
