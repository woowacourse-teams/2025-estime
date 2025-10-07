import { useEffect, useState, useCallback } from 'react';
import { useExtractQueryParams } from '../../../shared/hooks/common/useExtractQueryParams';
import { getRoomInfo } from '@/apis/room/room';
import type { RoomInfo } from '@/pages/CreateEvent/types/roomInfo';
import { initialCheckRoomInfo } from '@/constants/initialRoomInfo';
import { fromParseRoomInfo } from '@/apis/transform/fromParseRoomInfo';
import useFetch from '@/shared/hooks/common/useFetch';

const useCheckRoomSession = () => {
  const session = useExtractQueryParams('id');
  const { triggerFetch: getRoomSession } = useFetch({
    context: 'fetchSession',
    requestFn: useCallback(() => getRoomInfo(session), [session]),
  });

  const [roomInfo, setRoomInfo] = useState<
    RoomInfo & { roomSession: string; availableTimeSlots: string[] }
  >(initialCheckRoomInfo);

  const fetchSession = useCallback(async () => {
    const response = await getRoomSession();
    const parseData = fromParseRoomInfo(response);
    setRoomInfo(parseData);
  }, [getRoomSession]);

  useEffect(() => {
    if (!session) return;
    fetchSession();
  }, [session, fetchSession]);

  return { roomInfo, session };
};

export default useCheckRoomSession;
