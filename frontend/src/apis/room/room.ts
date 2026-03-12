import api from '../common';
import {
  CHANNEL_ROOM_API_PATH_V3,
  ROOM_API_PATH,
  ROOM_API_PATH_V2,
  ROOM_API_PATH_V3,
} from '../common/constant';
import type {
  CreateRoomResponseType,
  CreateRoomRequestType,
  GetRoomInfoResponseType,
  CreateUserRequestType,
  CreateUserResponseType,
  CreateChannelRoomRequestType,
  CreateRoomRequestTypeV3,
  GetRoomStatisticsResponseType,
  CreateChannelRoomRequestTypeV3,
  GetRoomInfoResponseTypeV3,
} from './type';

export const createRoom = async (body: CreateRoomRequestType): Promise<CreateRoomResponseType> => {
  return await api.post(`${ROOM_API_PATH}`, body);
};

export const createRoomV3 = async (
  body: CreateRoomRequestTypeV3
): Promise<CreateRoomResponseType> => {
  return await api.post(`${ROOM_API_PATH_V3}`, body);
};

export const createChannelRoom = async (
  body: CreateChannelRoomRequestType
): Promise<CreateRoomResponseType> => {
  return await api.post(`${CHANNEL_ROOM_API_PATH_V3}`, body);
};

export const createChannelRoomV3 = async (
  body: CreateChannelRoomRequestTypeV3
): Promise<CreateRoomResponseType> => {
  return await api.post(`${CHANNEL_ROOM_API_PATH_V3}`, body);
};

export const joinUser = async (
  sessionId: string,
  body: CreateUserRequestType
): Promise<CreateUserResponseType> => {
  return await api.post(`${ROOM_API_PATH}/${sessionId}/participants`, body);
};

export const getRoomInfo = async (sessionId: string): Promise<GetRoomInfoResponseType> => {
  return await api.get(`${ROOM_API_PATH}/${sessionId}`);
};

export const getRoomInfoV3 = async (sessionId: string): Promise<GetRoomInfoResponseTypeV3> => {
  return await api.get(`${ROOM_API_PATH_V3}/${sessionId}`);
};

export const getRoomStatistics = async (
  sessionId: string
): Promise<GetRoomStatisticsResponseType> => {
  return await api.get(`${ROOM_API_PATH_V2}/${sessionId}/statistics/date-time-slots`);
};
