import { useCallback } from 'react';
import { toCreateRoomInfoV3 } from '@/apis/transform/toCreateRoomInfo';
import { showToast } from '@/shared/store/toastStore';
import { getRoomInfo } from '@/pages/CreateEvent/store/createRoomStore';
import { CreateRoomRequestTypeV3 } from '@/apis/room/type';

export const usePastSlotFilter = () => {
  const getFilteredPayload = useCallback((): CreateRoomRequestTypeV3 => {
    const { payload, isPastSelected } = toCreateRoomInfoV3(getRoomInfo());

    if (isPastSelected)
      showToast({ type: 'success', message: `과거의 날짜가 자동으로 비활성화 되었습니다.` });

    return payload;
  }, []);

  return { getFilteredPayload };
};
