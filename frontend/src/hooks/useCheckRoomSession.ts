import { useEffect, useState } from 'react';
import { useExtractQueryParams } from './common/useExtractQueryParams';
import { getRoomInfo } from '@/apis/room/room';
import type { RoomInfo } from '@/types/roomInfo';
import { initialCheckRoomInfo } from '@/constants/initialRoomInfo';
import { fromParseRoomInfo } from '@/apis/transform/fromParseRoomInfo';
import * as Sentry from '@sentry/react';

const useCheckRoomSession = () => {
  const session = useExtractQueryParams('id');
  const [roomInfo, setRoomInfo] = useState<
    RoomInfo & { roomSession: string; availableTimeSlots: string[] }
  >(initialCheckRoomInfo);

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
      Sentry.captureException(err);
    }
  };

  useEffect(() => {
    fetchSession();
  }, [session]);

  return { roomInfo, session };
};

export default useCheckRoomSession;
