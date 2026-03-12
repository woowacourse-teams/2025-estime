import { createChannelRoomV3, createRoomV3 } from '@/apis/room/room';
import { useCallback, useState } from 'react';
import { useExtractQueryParams } from '@/shared/hooks/common/useExtractQueryParams';
import { usePastSlotFilter } from './usePastSlotFilter';

type checkedNotification = {
  created: boolean;
  remind: boolean;
  deadline: boolean;
};

export const useCreateRoom = () => {
  const { platformType, channelId } = useExtractQueryParams(['platformType', 'channelId'] as const);
  const { getFilteredPayload } = usePastSlotFilter();
  const [checkedNotification, setCheckedNotification] = useState<checkedNotification>({
    created: true,
    remind: true,
    deadline: true,
  });

  const notification = {
    value: checkedNotification,
    set: (id: keyof checkedNotification) =>
      setCheckedNotification((prev) => ({ ...prev, [id]: !prev[id] })),
  };

  const roomInfoSubmit = useCallback(async () => {
    const payload = getFilteredPayload();

    if (platformType && channelId) {
      const response = await createChannelRoomV3({
        ...payload,
        platformType: platformType as 'DISCORD' | 'SLACK',
        channelId: channelId || 'DISCORD',
        notification: checkedNotification,
      });
      return response?.session;
    }

    const response = await createRoomV3(payload);
    return response?.session;
  }, [channelId, checkedNotification, getFilteredPayload, platformType]);

  return {
    platformType,
    notification,
    roomInfoSubmit,
  };
};

export default useCreateRoom;
