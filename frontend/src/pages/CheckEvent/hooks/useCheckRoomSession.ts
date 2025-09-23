import { useEffect, useState } from 'react';
import { useExtractQueryParams } from '../../../shared/hooks/common/useExtractQueryParams';
import { getRoomInfo } from '@/apis/room/room';
import type { RoomInfo } from '@/pages/CreateEvent/types/roomInfo';
import { initialCheckRoomInfo } from '@/constants/initialRoomInfo';
import { fromParseRoomInfo } from '@/apis/transform/fromParseRoomInfo';
import * as Sentry from '@sentry/react';
import { useNavigate } from 'react-router';

const useCheckRoomSession = () => {
  const navigate = useNavigate();

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
      Sentry.captureException(err, {
        level: 'error',
      });
      navigate('/404', { replace: true });
      return;
    }
  };

  useEffect(() => {
    fetchSession();
  }, [session]);

  return { roomInfo, session };
};

export default useCheckRoomSession;
