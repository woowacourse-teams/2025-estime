import React, { useState } from 'react';
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
  // 상세 설정 상태
  const [isOpenAccordion, setIsOpenAccordion] = useState(false);
  const [isDeadlineEnable, setisDeadlineEnable] = useState(false);
  const [date, setDate] = useState('2025-07-19');

  const { title, availableDates } = useCreateRoom();

  return (
    <Wrapper maxWidth={1280} paddingTop="var(--padding-11)" paddingBottom="var(--padding-11)">
      <Flex justify="space-between" gap="var(--gap-9)">
        <Flex.Item flex={1}>
          <CalendarSettings availableDates={availableDates} />
        </Flex.Item>
        <Flex.Item flex={1}>
          <Flex direction="column" justify="space-between" gap="var(--gap-8)">
            <BasicSettings title={title} />
            <OptionSettings
              isOpenAccordion={isOpenAccordion}
              onToggleAccordion={() => setIsOpenAccordion((prev) => !prev)}
              isDeadlineEnable={isDeadlineEnable}
              onToggleDeadline={() => setisDeadlineEnable((prev) => !prev)}
              date={date}
              onDateChange={(e: React.ChangeEvent<HTMLInputElement>) => setDate(e.target.value)}
            />
            <Flex justify="flex-end">
              <Button
                color="primary"
                selected={true}
                size="small"
                onClick={() => navigate(`/check?id=${124124124}`)}
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
