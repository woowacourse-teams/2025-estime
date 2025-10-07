import { createChannelRoom, createRoom } from '@/apis/room/room';
import { toCreateRoomInfo } from '@/apis/transform/toCreateRoomInfo';

import { useCallback, useState } from 'react';
import { useExtractQueryParams } from '@/shared/hooks/common/useExtractQueryParams';
import useFetch from '@/shared/hooks/common/useFetch';
import { getRoomInfo } from '@/pages/CreateEvent/store/createRoomStore';

type checkedNotification = {
  created: boolean;
  remind: boolean;
  deadline: boolean;
};

export const useCreateRoom = () => {
  const { platformType, channelId } = useExtractQueryParams(['platformType', 'channelId'] as const);
  const [checkedNotification, setCheckedNotification] = useState<checkedNotification>({
    created: true,
    remind: true,
    deadline: true,
  });

  const { triggerFetch: roomWithPlatformSubmit } = useFetch({
    context: 'roomInfoSubmit',
    requestFn: () =>
      createChannelRoom({
        ...toCreateRoomInfo(getRoomInfo()),
        platformType: platformType as 'DISCORD' | 'SLACK',
        channelId: channelId || 'DISCORD',
        notification: checkedNotification,
      }),
  });

  const { triggerFetch: roomSubmit } = useFetch({
    context: 'roomInfoSubmit',
    requestFn: () => createRoom(toCreateRoomInfo(getRoomInfo())),
  });

  const notification = {
    value: checkedNotification,
    set: (id: keyof checkedNotification) =>
      setCheckedNotification((prev) => ({ ...prev, [id]: !prev[id] })),
  };

  const roomInfoSubmit = useCallback(async () => {
    if (platformType && channelId) {
      const response = await roomWithPlatformSubmit();
      return response?.session;
    }

    const response = await roomSubmit();
    return response?.session;
  }, [channelId, platformType, roomSubmit, roomWithPlatformSubmit]);

  return {
    platformType,
    notification,
    roomInfoSubmit,
  };
};

export default useCreateRoom;
