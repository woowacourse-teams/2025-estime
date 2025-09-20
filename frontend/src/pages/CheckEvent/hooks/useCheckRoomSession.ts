import { useEffect, useState } from 'react';
import { useExtractQueryParams } from '../../../shared/hooks/common/useExtractQueryParams';
import { getRoomInfo } from '@/apis/room/room';
import type { RoomInfo } from '@/pages/CreateEvent/types/roomInfo';
import { initialCheckRoomInfo } from '@/constants/initialRoomInfo';
import { fromParseRoomInfo } from '@/apis/transform/fromParseRoomInfo';
import { useNavigate } from 'react-router';
import useFetch from '@/shared/hooks/common/useFetch';

const useCheckRoomSession = () => {
  const { runFetch } = useFetch();
  const navigate = useNavigate();

  let session = useExtractQueryParams('id');
  const [roomInfo, setRoomInfo] = useState<
    RoomInfo & { roomSession: string; availableTimeSlots: string[] }
  >(initialCheckRoomInfo);
  const [isSessionExist, setIsSessionExist] = useState(false);

  const fetchSession = async () => {
    if (!session) return;

    const response = await runFetch({
      context: 'fetchSession',
      requestFn: () => getRoomInfo(session),
    });

    if (response === undefined) {
      setIsSessionExist(false);
      navigate('/404', { replace: true });
      return;
    }

    setIsSessionExist(true);
    const parseData = fromParseRoomInfo(response);
    setRoomInfo(parseData);
  };

  useEffect(() => {
    fetchSession();
  }, [session]);

  return { roomInfo, session, isRoomSessionExist: isSessionExist };
};

export default useCheckRoomSession;
