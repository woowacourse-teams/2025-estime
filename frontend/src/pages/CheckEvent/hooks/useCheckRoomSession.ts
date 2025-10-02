import { useEffect, useState, useCallback } from 'react';
import { useExtractQueryParams } from '../../../shared/hooks/common/useExtractQueryParams';
import { getRoomInfo } from '@/apis/room/room';
import type { RoomInfo } from '@/pages/CreateEvent/types/roomInfo';
import { initialCheckRoomInfo } from '@/constants/initialRoomInfo';
import { fromParseRoomInfo } from '@/apis/transform/fromParseRoomInfo';
import { useNavigate } from 'react-router';
import useFetch from '@/shared/hooks/common/useFetch';
import { DateManager } from '@/shared/utils/common/DateManager';

const useCheckRoomSession = () => {
  const { triggerFetch: getRoomSession } = useFetch({
    context: 'fetchSession',
    requestFn: () => getRoomInfo(session),
  });
  const navigate = useNavigate();

  const session = useExtractQueryParams('id');
  const [roomInfo, setRoomInfo] = useState<
    RoomInfo & { roomSession: string; availableTimeSlots: string[] }
  >(initialCheckRoomInfo);

  const fetchSession = useCallback(async () => {
    if (!session) return;

    const response = await getRoomSession();
    if (response === undefined) {
      // navigate('/404', { replace: true });
      return;
    }

    const parseData = fromParseRoomInfo(response);
    setRoomInfo(parseData);
  }, [navigate, session]);

  const isExpired = DateManager.IsPastDeadline(roomInfo.deadline);

  useEffect(() => {
    fetchSession();
  }, [session, fetchSession]);

  return { roomInfo, session, isExpired };
};

export default useCheckRoomSession;
