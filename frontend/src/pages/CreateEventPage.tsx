import Flex from '@/components/Layout/Flex';
import Wrapper from '@/components/Layout/Wrapper';
import BasicSettings from '@/components/Sections/BasicSettings';
import CalendarSettings from '@/components/Sections/CalendarSettings';
import Button from '@/components/Button';
import Text from '@/components/Text';
import { useNavigate } from 'react-router';
import useCreateRoom from '@/hooks/useCreateRoom';
import Information from '@/components/Information';
import { useTheme } from '@emotion/react';
import IInfo from '@/icons/IInfo';
import useSectionValidation from '@/hooks/CreateRoom/useSectionValidation';

const CreateEventPage = () => {
  const navigate = useNavigate();
  const { colors } = useTheme();

  const {
    title,
    availableDateSlots,
    time,
    deadline,
    isCalendarReady,
    isBasicReady,
    roomInfoSubmit,
  } = useCreateRoom();
  const { CalendarRef, BasicSettingsRef, showValidation, shouldShake, validateSection } =
    useSectionValidation(isCalendarReady, isBasicReady);

  const handleCreateRoom = async () => {
    if (!validateSection()) {
      return;
    }

    const session = await roomInfoSubmit();
    if (session) {
      navigate(`/check?id=${session}`, { replace: true });
    }
  };

  return (
    <Wrapper maxWidth={1280} paddingTop="var(--padding-11)" paddingBottom="var(--padding-11)">
      <Flex justify="space-between" gap="var(--gap-9)">
        <Flex.Item flex={1}>
          <CalendarSettings
            availableDateSlots={availableDateSlots}
            CalendarRef={CalendarRef}
            isValid={showValidation || isCalendarReady}
            shouldShake={shouldShake}
          />
        </Flex.Item>
        <Flex.Item flex={1}>
          <Flex direction="column" justify="space-between" gap="var(--gap-8)">
            <BasicSettings
              title={title}
              time={time}
              deadline={deadline}
              BasicSettingsRef={BasicSettingsRef}
              isValid={showValidation || isBasicReady}
              shouldShake={shouldShake}
            />
            <Information color="orange30">
              <IInfo color={colors.orange40} />
              <Text variant="h4" color="orange40">
                마감 기한은 약속을 생성한 시점으로부터 1일 뒤까지로 자동 설정되어 있습니다.
              </Text>
            </Information>
            <Flex justify="flex-end">
              <Button
                color="primary"
                selected={true}
                size="small"
                onClick={handleCreateRoom}
                data-ga-id="create-event-button"
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
