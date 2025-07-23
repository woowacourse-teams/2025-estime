import Timetable from '@/components/Timetable';
import useCheckRoomSession from '@/hooks/useCheckRoomSession';
import useUserAvailability from '@/hooks/useUserAvailablity';

const CheckEventPage = () => {
  const roomInfo = useCheckRoomSession();
  const userAvailability = useUserAvailability();

  return (
    <div>
      <Timetable
        startTime={roomInfo.time.startTime}
        endTime={roomInfo.time.endTime}
        availableDates={roomInfo.availableDates}
        session={roomInfo.roomSession}
        userAvailability={userAvailability}
      />
    </div>
  );
};

export default CheckEventPage;
