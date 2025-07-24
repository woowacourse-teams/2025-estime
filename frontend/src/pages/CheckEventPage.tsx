import Timetable from '@/components/Timetable';
import useCheckRoomSession from '@/hooks/useCheckRoomSession';
import useUserAvailability from '@/hooks/useUserAvailablity';
import { useEffect, useRef } from 'react';

const CheckEventPage = () => {
  const { roomInfo, session } = useCheckRoomSession();
  const name = '메이토';
  const userAvailability = useUserAvailability({ name, session });
  const ref = useRef(null);

  useEffect(() => {
    console.log(ref.current);
  }, []);

  return (
    <div>
      <Timetable
        time={roomInfo.time}
        availableDates={roomInfo.availableDates}
        userAvailability={userAvailability}
        ref={ref}
      />
    </div>
  );
};

export default CheckEventPage;
