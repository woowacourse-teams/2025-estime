import Text from '@/shared/components/Text';
import * as S from './BasicSettings.styled';
import Input from '@/shared/components/Input';
import useSelectTime from '@/pages/CreateEvent/hooks/useSelectTime';
import { Field } from '@/pages/CreateEvent/types/field';
import { useMemo } from 'react';
import DatePicker from '@/shared/components/DatePicker';
import Flex from '@/shared/layout/Flex';
import useToggleState from '@/shared/hooks/common/useToggleState';
import { TimeManager } from '@/shared/utils/common/TimeManager';
import TimePicker from '@/shared/components/Timepicker';

type BasicSettingsProps = {
  title: Field<string>;
  time: Field<{ startTime: string; endTime: string }> & { valid: boolean };
  deadline: Field<{ date: string; time: string }>;
  isValid: boolean;
  shouldShake: boolean;
};

const BasicSettings = ({ title, time, deadline, isValid, shouldShake }: BasicSettingsProps) => {
  const { isOpen: isStartOpen, toggleOpen: toggleStartOpen } = useToggleState();
  const { isOpen: isEndOpen, toggleOpen: toggleEndOpen } = useToggleState();
  const { isOpen: isDeadLineOpen, toggleOpen: toggleDeadLineOpen } = useToggleState();

  const deadlineHourOptions = useMemo(() => {
    return TimeManager.filterHourOptions(deadline.value);
  }, [deadline.value.date, deadline.value.time]);

  const {
    timeRange,
    startHourOptions,
    endHourOptions,
    handleCustomStartClick,
    handleCustomEndClick,
  } = useSelectTime({ timeRange: time.value, setTimeRange: time.set });
  return (
    <S.Container isValid={isValid} shouldShake={shouldShake}>
      <S.InfoWrapper>
        <S.TextWrapper>
          <Text variant="h3">제목</Text>
          <Text variant="h4">참여자들에게 표시될 약속의 제목을 입력해주세요.</Text>
        </S.TextWrapper>
        <S.InputWrapper>
          <Input
            placeholder="예: 아인슈타임 정기 산악회"
            value={title.value}
            onChange={(e) => title.set(e.target.value)}
            maxLength={20}
          />
        </S.InputWrapper>
      </S.InfoWrapper>
      <S.InfoWrapper>
        <S.TextWrapper>
          <Text variant="h3">시간 선택</Text>
          <Text variant="h4">참여자가 선택할 수 있는 시간의 범위를 설정합니다.</Text>
        </S.TextWrapper>

        <Flex direction="column" gap="var(--gap-2)">
          <Flex direction="row" gap="var(--gap-4)">
            <S.Label>
              <Text variant="body">시작 시간</Text>
              <TimePicker
                selectedHour={timeRange.startTime}
                selectHour={handleCustomStartClick}
                toggleOpen={toggleStartOpen}
                isOpen={isStartOpen}
                hourOptions={startHourOptions}
              />
            </S.Label>
            <S.Label>
              <Text variant="body">종료 시간</Text>
              <TimePicker
                selectedHour={timeRange.endTime}
                selectHour={handleCustomEndClick}
                toggleOpen={toggleEndOpen}
                isOpen={isEndOpen}
                hourOptions={endHourOptions}
              />
            </S.Label>
          </Flex>

          {!time.valid && (
            <Text variant="caption" color="red40">
              종료 시간은 시작 시간보다 빠를 수 없습니다. 다시 선택해주세요.
            </Text>
          )}
        </Flex>
      </S.InfoWrapper>
      <S.InfoWrapper>
        <S.TextWrapper>
          <Text variant="h3">투표 마감 기한</Text>
          <Text variant="h4">참여자들이 응답할 수 있는 마감 기한을 설정합니다.</Text>
        </S.TextWrapper>
        <Flex gap="var(--gap-4)">
          <DatePicker
            value={deadline.value.date}
            onChange={(e) => deadline.set({ date: e.target.value, time: deadline.value.time })}
          />
          <TimePicker
            selectedHour={deadline.value.time}
            selectHour={(hour: string) => deadline.set({ date: deadline.value.date, time: hour })}
            toggleOpen={toggleDeadLineOpen}
            isOpen={isDeadLineOpen}
            hourOptions={deadlineHourOptions}
          />
        </Flex>
      </S.InfoWrapper>
    </S.Container>
  );
};

export default BasicSettings;
