import baseFetch from '../common/baseFetch';
import { baseURL } from '../common/constant';
import { CreateRoomResponse, CreateRoomRequest, GetRoomInfoResponse } from './type';

export const postCreateRoom = async (body: CreateRoomRequest): Promise<CreateRoomResponse> => {
  return await baseFetch(`${baseURL}`, 'POST', undefined, body);
};

export const getRoomInfo = async (sessionId: string): Promise<GetRoomInfoResponse> => {
  return await baseFetch(`${baseURL}/${sessionId}`, 'GET');
};
