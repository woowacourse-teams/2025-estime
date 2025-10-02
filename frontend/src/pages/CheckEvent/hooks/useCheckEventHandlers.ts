import { useReducer } from 'react';
import modeReducer from '../reducers/modeReducer';
import { modalReducer } from '../reducers/modalReducer';
import { CreateUserResponseType } from '@/apis/room/type';
import { updateUserAvailableTimeType } from '@/apis/time/type';
import { useTimeSelectionContext } from '../contexts/TimeSelectionContext';
import { userAvailabilityStore } from '../stores/userAvailabilityStore';
import { showToast } from '@/shared/store/toastStore';

const BUTTON_NAME = {
  register: '등록하기',
  save: '저장하기',
  edit: '수정하기',
};

const initalModalState = {
  login: false,
  entryConfirm: false,
  copyLink: false,
};

interface CheckEventHandlers {
  handleLogin: () => Promise<CreateUserResponseType | undefined>;
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
  const [modal, modalDispatch] = useReducer(modalReducer, initalModalState);
  const { getCurrentSelectedTimes } = useTimeSelectionContext();

  // 등록하기 버튼 클릭 -> 로그인 모달 open
  //   const

  const handleLoginModalButtonClick = async () => {
    const data = await handleLogin();
    if (data?.isDuplicateName) {
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

  const handleCopyLinkButtonClick = () => modalDispatch('open_copylink');

  // 통합 이벤트 핸들러 = 버튼에 달릴 최종 이벤트 핸들러

  const handleButtonClick = async () => {
    if (buttonMode === 'register') {
      modalDispatch('open_login');
    } else if (buttonMode === 'save') {
      const currentTimes = getCurrentSelectedTimes();
      userAvailabilityStore.setState((prev) => ({ ...prev, selectedTimes: currentTimes }));
      // 추후ㅜ 수정되어야함. 묶어야한다. 위에 2개
      await handleUserAvailabilitySubmit();
      pageReset();
      showToast({
        type: 'success',
        message: '시간표 저장이 완료되었습니다!',
      });

      buttonModeDispatch('click_save');
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
    handleCopyLinkButtonClick,
  };
};

export default useCheckEventHandlers;
