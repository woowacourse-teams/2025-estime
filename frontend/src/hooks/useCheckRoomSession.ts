import { useEffect, useState } from 'react';
import { useExtractQueryParams } from './common/useExtractQueryParams';
import { getRoomInfo } from '@/apis/room/room';
import type { RoomInfo } from '@/types/roomInfo';
import { initialCheckRoomInfo } from '@/constants/initialRoomInfo';
import { fromParseRoomInfo } from '@/apis/transform/fromParseRoomInfo';
import * as Sentry from '@sentry/react';
import { useToastContext } from '@/contexts/ToastContext';

const useCheckRoomSession = () => {
  const { addToast } = useToastContext();

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
      addToast({
        type: 'error',
        message: e.message,
      });
      Sentry.captureException(err, {
        level: 'error',
      });
    }
  };

  useEffect(() => {
    fetchSession();
  }, [session]);

  return { roomInfo, session };
};

export default useCheckRoomSession;
