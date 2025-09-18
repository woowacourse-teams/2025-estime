import { useEffect, useState } from 'react';
import { useExtractQueryParams } from '../../../shared/hooks/common/useExtractQueryParams';
import { getRoomInfo } from '@/apis/room/room';
import type { RoomInfo } from '@/pages/CreateEvent/types/roomInfo';
import { initialCheckRoomInfo } from '@/constants/initialRoomInfo';
import { fromParseRoomInfo } from '@/apis/transform/fromParseRoomInfo';
import * as Sentry from '@sentry/react';
// import { useToastContext } from '@/contexts/ToastContext';
import { useNavigate } from 'react-router';
import { DateManager } from '@/shared/utils/common/DateManager';

const useCheckRoomSession = () => {
  // const { addToast } = useToastContext();
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
      // const e = err as Error;
      // TODO: 이렇게 에러를 처리하기
      // if (e.message === 'Room not found') {
      //   addToast({
      //     type: 'warning',
      //     message: '존재하지 않는 방입니다.',
      //   });
      //   router('/');

      //   return;
      // }
      // 임시 방편으로 모든 에러를 500이든 400이든 404로 처리.
      Sentry.captureException(err, {
        level: 'error',
      });
      navigate('/404', { replace: true });
      return;
    }
  };

  const isExpired = DateManager.IsPastDeadline(roomInfo.deadline);

  useEffect(() => {
    fetchSession();
  }, [session]);

  return { roomInfo, session, isExpired };
};

export default useCheckRoomSession;
