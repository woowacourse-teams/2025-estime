import Text from '@/shared/components/Text';
import * as S from './BasicSettings.styled';
import Input from '@/shared/components/Input';
import useSelectTime from '@/pages/CreateEvent/hooks/useSelectTime';
import { useMemo } from 'react';
import DatePicker from '@/shared/components/DatePicker';
import Flex from '@/shared/layout/Flex';
import useToggleState from '@/shared/hooks/common/useToggleState';
import { TimeManager } from '@/shared/utils/common/TimeManager';
import TimePicker from '@/shared/components/Timepicker';
import {
  onChangeDeadline,
  onChangeTime,
  onChangeTitle,
  useRoomSelector,
} from '@/pages/CreateEvent/store/createRoomStore';
import { checkTimeRangeValid } from '@/pages/CreateEvent/utils/CreateRoomValidator';

type BasicSettingsProps = {
  isValid: boolean;
  shouldShake: boolean;
};

const BasicSettings = ({ isValid, shouldShake }: BasicSettingsProps) => {
  return (
    <S.Container isValid={isValid} shouldShake={shouldShake}>
      <TitleSettings />
      <TimeSettings />
      <DeadlineSettings />
    </S.Container>
  );
};

export const TitleSettings = () => {
  const title = useRoomSelector('title');
  return (
    <S.InfoWrapper>
      <S.TextWrapper>
        <Text variant="h3">제목</Text>
        <Text variant="h4">참여자들에게 표시될 약속의 제목을 입력해주세요.</Text>
      </S.TextWrapper>
      <S.InputWrapper>
        <Input
          placeholder="예: 아인슈타임 정기 산악회"
          value={title}
          onChange={(e) => onChangeTitle(e.target.value)}
          maxLength={20}
        />
      </S.InputWrapper>
    </S.InfoWrapper>
  );
};

export const TimeSettings = () => {
  const time = useRoomSelector('time');
  const {
    timeRange,
    startHourOptions,
    endHourOptions,
    handleCustomStartClick,
    handleCustomEndClick,
  } = useSelectTime({ timeRange: time, setTimeRange: onChangeTime });

  const { isOpen: isStartOpen, toggleOpen: toggleStartOpen } = useToggleState();
  const { isOpen: isEndOpen, toggleOpen: toggleEndOpen } = useToggleState();

  return (
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

        {!checkTimeRangeValid() && (
          <Text variant="caption" color="red40">
            종료 시간은 시작 시간보다 빠를 수 없습니다. 다시 선택해주세요.
          </Text>
        )}
      </Flex>
    </S.InfoWrapper>
  );
};

export const DeadlineSettings = () => {
  const deadline = useRoomSelector('deadline');

  const deadlineHourOptions = useMemo(() => {
    return TimeManager.filterHourOptions(deadline);
  }, [deadline]);
  const { isOpen: isDeadLineOpen, toggleOpen: toggleDeadLineOpen } = useToggleState();

  return (
    <S.InfoWrapper>
      <S.TextWrapper>
        <Text variant="h3">투표 마감 기한</Text>
        <Text variant="h4">참여자들이 응답할 수 있는 마감 기한을 설정합니다.</Text>
      </S.TextWrapper>
      <Flex gap="var(--gap-4)">
        <DatePicker
          value={deadline.date}
          onChange={(e) => onChangeDeadline({ date: e.target.value, time: deadline.time })}
        />
        <TimePicker
          selectedHour={deadline.time}
          selectHour={(hour: string) => onChangeDeadline({ date: deadline.date, time: hour })}
          toggleOpen={toggleDeadLineOpen}
          isOpen={isDeadLineOpen}
          hourOptions={deadlineHourOptions}
        />
      </Flex>
    </S.InfoWrapper>
  );
};

export default BasicSettings;
