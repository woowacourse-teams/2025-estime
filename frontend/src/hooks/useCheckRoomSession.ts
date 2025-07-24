import { useEffect, useState } from 'react';
import { useExtractQueryParam } from './common/useExtractQueryParam';
import { getRoomInfo } from '@/apis/room/room';
import type { RoomInfo } from '@/types/roomInfo';
import { initialRoomInfo } from '@/constants/initialRoomInfo';
import { fromParseRoomInfo } from '@/apis/transform/fromParseRoomInfo';

const useCheckRoomSession = () => {
  const session = useExtractQueryParam('id');
  const [roomInfo, setRoomInfo] = useState<RoomInfo & { roomSession: string }>({
    ...initialRoomInfo,
    roomSession: '',
  });

  const fetchSession = async () => {
    if (!session) return;

    try {
      const response = await getRoomInfo(session);
      const parseData = fromParseRoomInfo(response);
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

  return { roomInfo, session };
};

export default useCheckRoomSession;
