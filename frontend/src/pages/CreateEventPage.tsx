import Flex from '@/components/Layout/Flex';
import Wrapper from '@/components/Layout/Wrapper';
import BasicSettings from '@/components/Sections/BasicSettings';
import OptionSettings from '@/components/Sections/OptionSettings';
import CalendarSettings from '@/components/Sections/CalendarSettings';
import Button from '@/components/Button';
import Text from '@/components/Text';
import { useNavigate } from 'react-router';
import useCreateRoom from '@/hooks/useCreateRoom';

const CreateEventPage = () => {
  const navigate = useNavigate();
  const { title, availableDates, time, deadLine, isPublic, isReadyToCreateRoom, roomInfoSubmit } =
    useCreateRoom();

  const handleCreateRoom = async () => {
    const session = await roomInfoSubmit();
    if (session) {
      navigate(`/check?id=${session}`);
    }
  };

  return (
    <Wrapper maxWidth={1280} paddingTop="var(--padding-11)" paddingBottom="var(--padding-11)">
      <Flex justify="space-between" gap="var(--gap-9)">
        <Flex.Item flex={1}>
          <CalendarSettings availableDates={availableDates} />
        </Flex.Item>
        <Flex.Item flex={1}>
          <Flex direction="column" justify="space-between" gap="var(--gap-8)">
            <BasicSettings title={title} time={time} />
            <OptionSettings deadLine={deadLine} isPublic={isPublic} />
            <Flex justify="flex-end">
              <Button
                color={isReadyToCreateRoom ? 'primary' : 'plum40'}
                selected={true}
                size="small"
                disabled={!isReadyToCreateRoom}
                onClick={handleCreateRoom}
              >
                <Text variant="button" color="background">
                  방 만들기
                </Text>
              </Button>
            </Flex>
          </Flex>
        </Flex.Item>
      </Flex>
    </Wrapper>
  );
};

export default CreateEventPage;
