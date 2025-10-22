import { useEffect, useState, useCallback } from 'react';
import { useExtractQueryParams } from '@/shared/hooks/common/useExtractQueryParams';
import { getRoomInfo } from '@/apis/room/room';
import type { RoomInfo } from '@/pages/CreateEvent/types/roomInfo';
import { initialCheckRoomInfo } from '@/constants/initialRoomInfo';
import { fromParseRoomInfo } from '@/apis/transform/fromParseRoomInfo';
import useFetch from '@/shared/hooks/common/useFetch';
import { useAnnounceContext } from '@/shared/contexts/AnnounceContext';

const useCheckRoomSession = () => {
  const session = useExtractQueryParams('id');
  const { triggerFetch: getRoomSession } = useFetch({
    context: 'fetchSession',
    requestFn: useCallback(() => getRoomInfo(session), [session]),
  });

  const [roomInfo, setRoomInfo] = useState<
    RoomInfo & { roomSession: string; availableTimeSlots: string[] }
  >(initialCheckRoomInfo);

  const { roomInfoAnnounce } = useAnnounceContext();

  const announceRoomInfo = useCallback(
    (title: string, deadline: { date: string; time: string }) => {
      const deadlineString = new Date(deadline.date + 'T' + deadline.time).toLocaleString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      roomInfoAnnounce.announce(
        `${title} 방에 들어왔습니다. 투표 기간은 ${deadlineString}까지 입니다.`
      );
    },
    [roomInfoAnnounce]
  );

  const fetchSession = useCallback(async () => {
    const response = await getRoomSession();
    const parseData = fromParseRoomInfo(response);
    setRoomInfo(parseData);
    announceRoomInfo(parseData.title, parseData.deadline);
  }, [getRoomSession, announceRoomInfo]);

  useEffect(() => {
    if (!session) return;
    fetchSession();
  }, [session, fetchSession]);

  return { roomInfo, session };
};

export default useCheckRoomSession;
