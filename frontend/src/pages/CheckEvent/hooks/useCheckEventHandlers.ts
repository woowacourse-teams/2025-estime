import { useReducer } from 'react';
import modeReducer from '../reducers/modeReducer';
import { ModalAction, modalReducer } from '../reducers/modalReducer';
import { CreateUserResponseType } from '@/apis/room/type';
import { updateUserAvailableTimeType } from '@/apis/time/type';
import { userAvailabilityStore } from '../stores/userAvailabilityStore';
import { showToast } from '@/shared/store/toastStore';
import { addOptimisticUpdate, rollbackOptimisticUpdate } from '../utils/optimisticUpdate';

const BUTTON_NAME = {
  register: '등록하기',
  save: '저장하기',
  edit: '수정하기',
};

const initialModalState = {
  login: false,
  entryConfirm: false,
  copyLink: false,
};

interface CheckEventHandlers {
  handleLogin: () => Promise<CreateUserResponseType>;
  fetchUserAvailableTime: () => Promise<void>;
  handleUserAvailabilitySubmit: () => Promise<updateUserAvailableTimeType | undefined>;
  pageReset: () => void;
}

const useCheckEventHandlers = ({
  handleLogin,
  fetchUserAvailableTime,
  handleUserAvailabilitySubmit,
  pageReset,
}: CheckEventHandlers) => {
  const [buttonMode, buttonModeDispatch] = useReducer(modeReducer, 'register');
  const [modal, modalDispatch] = useReducer(modalReducer, initialModalState);

  // 등록하기 버튼 클릭 -> 로그인 모달 open

  const handleLoginModalButtonClick = async () => {
    const data = await handleLogin();
    if (data.isDuplicateName) {
      modalDispatch('open_confirm');
      return;
    }
    await fetchUserAvailableTime();
    modalDispatch('close_login');
    buttonModeDispatch('complete_login');
  };

  const handleConfirmModalButtonClick = async (type: 'Y' | 'N') => {
    if (type === 'Y') {
      modalDispatch('close_confirm');
      modalDispatch('close_login');
      await fetchUserAvailableTime();
      buttonModeDispatch('complete_login');
    } else {
      modalDispatch('close_confirm');
    }
  };

  const handleModalClick = (action: ModalAction) => modalDispatch(action);

  // 통합 이벤트 핸들러 = 버튼에 달릴 최종 이벤트 핸들러
  const handleButtonClick = async () => {
    if (buttonMode === 'register') {
      modalDispatch('open_login');
    } else if (buttonMode === 'save') {
      const currentTimes = userAvailabilityStore.getSnapshot().selectedTimes;
      const prevSnapshot = addOptimisticUpdate(userAvailabilityStore, (prev) => ({
        ...prev,
        selectedTimes: currentTimes,
      }));

      try {
        await handleUserAvailabilitySubmit();
        pageReset();

        showToast({ type: 'success', message: '시간표 저장이 완료되었습니다!' });
        buttonModeDispatch('click_save');
      } catch {
        rollbackOptimisticUpdate(userAvailabilityStore, prevSnapshot);
        showToast({ type: 'error', message: '저장 중 오류가 발생했습니다.' });
      }
    } else if (buttonMode === 'edit') {
      buttonModeDispatch('click_edit');
    }
  };

  return {
    buttonMode,
    buttonName: BUTTON_NAME[buttonMode],
    modal,
    handleButtonClick,
    handleLoginModalButtonClick,
    handleConfirmModalButtonClick,
    handleModalClick,
  };
};

export default useCheckEventHandlers;
