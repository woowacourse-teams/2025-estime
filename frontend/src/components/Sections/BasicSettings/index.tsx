import Text from '@/components/Text';
import * as S from './BasicSettings.styled';
import Input from '@/components/Input';
import Button from '@/components/Button';
import TimePicker from '@/components/Timepicker';
import useTimePicker from '@/hooks/useTimePicker';
import useSelectTime from '@/hooks/useSelectTime';
import ISun from '@/icons/ISun';
import IMoon from '@/icons/IMoon';
import { Field } from '@/types/field';
import useChangeIconColor from '@/hooks/common/useChangeIconColor';

type BasicSettingsProps = {
  title: Field<string>;
  time: Field<{ startTime: string; endTime: string }> & { valid: boolean };
};

const BasicSettings = ({ title, time }: BasicSettingsProps) => {
  const { isOpen: isStartOpen, toggleOpen: toggleStartOpen } = useTimePicker();

  const { isOpen: isEndOpen, toggleOpen: toggleEndOpen } = useTimePicker();

  const {
    timeRange,
    selectedButtons,
    handleDayNightButtonClick,
    handleCustomButtonClick,
    handleCustomStartClick,
    handleCustomEndClick,
  } = useSelectTime({ timeRange: time.value, setTimeRange: time.set });

  return (
    <S.Container>
      <S.InfoWrapper>
        <S.TextWrapper>
          <Text variant="h3">방 제목</Text>
          <Text variant="body">참여자들에게 표시될 방의 제목을 입력해주세요.</Text>
        </S.TextWrapper>
        <S.InputWrapper>
          <Input
            placeholder="예: 1팀 7월 정기 회의"
            value={title.value}
            onChange={(e) => title.set(e.target.value)}
          />
        </S.InputWrapper>
      </S.InfoWrapper>
      <S.InfoWrapper>
        <S.TextWrapper>
          <Text variant="h3">시간 선택</Text>
          <Text variant="body">참여자가 선택할 수 있는 시간의 범위를 설정합니다.</Text>
        </S.TextWrapper>
        <S.ButtonWrapper>
          <Button
            color="orange40"
            onClick={() => handleDayNightButtonClick('day')}
            selected={selectedButtons.includes('day')}
          >
            <ISun
              color={useChangeIconColor({
                defaultColor: 'secondary',
                isSelected: selectedButtons.includes('day'),
              })}
            />
            <Text
              variant="button"
              color={selectedButtons.includes('day') ? 'background' : 'secondary'}
            >
              9~18시
            </Text>
          </Button>
          <Button
            color="primary"
            onClick={() => handleDayNightButtonClick('night')}
            selected={selectedButtons.includes('night')}
          >
            <IMoon
              color={useChangeIconColor({
                defaultColor: 'primary',
                isSelected: selectedButtons.includes('night'),
              })}
            />

            <Text
              variant="button"
              color={selectedButtons.includes('night') ? 'background' : 'primary'}
            >
              18~24시
            </Text>
          </Button>
          <Button
            color="primary"
            onClick={handleCustomButtonClick}
            selected={selectedButtons.includes('custom')}
          >
            <Text
              variant="button"
              color={selectedButtons.includes('custom') ? 'background' : 'primary'}
            >
              커스텀
            </Text>
          </Button>
        </S.ButtonWrapper>

        {selectedButtons.includes('custom') && (
          <>
            <S.CustomTimeWrapper selected={selectedButtons.includes('custom')}>
              <S.Label>
                <Text variant="body">시작 시간</Text>
                <TimePicker
                  selectedHour={timeRange.startTime}
                  selectHour={handleCustomStartClick}
                  toggleOpen={toggleStartOpen}
                  isOpen={isStartOpen}
                />
              </S.Label>
              <S.Label>
                <Text variant="body">종료 시간</Text>
                <TimePicker
                  selectedHour={timeRange.endTime}
                  selectHour={handleCustomEndClick}
                  toggleOpen={toggleEndOpen}
                  isOpen={isEndOpen}
                />
              </S.Label>
            </S.CustomTimeWrapper>
            {!time.valid && (
              <Text variant="caption" color="red40">
                종료 시간은 시작 시간보다 빠를 수 없습니다. 다시 선택해주세요.
              </Text>
            )}
          </>
        )}
      </S.InfoWrapper>
    </S.Container>
  );
};

export default BasicSettings;
