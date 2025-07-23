import { useEffect, useState } from 'react';
import { useExtractQueryParam } from './common/useExtractQueryParam';
import { initialRoomInfo, RoomInfo } from './useCreateRoom';
import { getRoomInfo } from '@/apis/room/room';
import { parseRoomInfoResponse } from '@/apis/transform/parseRoomInfoResponse';

const useCheckRoomSession = () => {
  const session = useExtractQueryParam('id');
  const [roomInfo, setRoomInfo] = useState<RoomInfo>(initialRoomInfo);

  const fetchSession = async () => {
    try {
      const response = await getRoomInfo(session);
      const parseData = parseRoomInfoResponse(response);
      setRoomInfo(parseData);
    } catch (err) {
      const e = err as Error;
      alert(e.message);
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSession();
  }, [session]);

  return roomInfo;
};

export default useCheckRoomSession;
