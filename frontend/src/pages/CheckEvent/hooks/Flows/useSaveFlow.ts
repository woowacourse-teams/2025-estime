import { updateUserAvailableTimeType } from '@/apis/time/type';
import { showToast } from '@/shared/store/toastStore';
import { userAvailabilityStore } from '../../stores/userAvailabilityStore';

interface SaveFlowParams {
  performUserSubmit: () => Promise<updateUserAvailableTimeType | undefined>;
  pageReset: () => void;
  onComplete: () => void;
}

const useSaveFlow = ({ performUserSubmit, pageReset, onComplete }: SaveFlowParams) => {
  const execute = async () => {
    const currentTimes = userAvailabilityStore.getSnapshot().selectedTimes;
    userAvailabilityStore.setState((prev) => ({ ...prev, selectedTimes: currentTimes }));

    await performUserSubmit();
    pageReset();

    showToast({
      type: 'success',
      message: '시간표 저장이 완료되었습니다!',
    });

    setTimeout(() => {
      onComplete();
    }, 200);
  };

  return {
    label: '저장하기',
    execute,
  };
};

export default useSaveFlow;
