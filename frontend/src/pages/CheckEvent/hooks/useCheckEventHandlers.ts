import { useCallback, useReducer, useRef } from 'react';
import modeReducer from '../reducers/modeReducer';
import { ModalAction, modalReducer } from '../reducers/modalReducer';
import { CreateUserResponseType } from '@/apis/room/type';
import { UpdateUserAvailableTimeType } from '@/apis/time/type';
import { userAvailabilityStore } from '../stores/userAvailabilityStore';
import { showToast } from '@/shared/store/toastStore';
import { userNameStore } from '../stores/userNameStore';

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
  handleUserAvailabilitySubmit: () => Promise<UpdateUserAvailableTimeType | undefined>;
  pageReset: () => void;
}

const useCheckEventHandlers = ({
  handleLogin,
  fetchUserAvailableTime,
  handleUserAvailabilitySubmit,
  pageReset,
}: CheckEventHandlers) => {
  const awaitingSaveRef = useRef(false);

  const [buttonMode, buttonModeDispatch] = useReducer(modeReducer, 'register');
  const [modal, modalDispatch] = useReducer(modalReducer, initialModalState);

  const handleLoginModalButtonClick = async () => {
    const data = await handleLogin();
    if (data.isDuplicateName) {
      modalDispatch('open_confirm');
      return;
    }
    await fetchUserAvailableTime();
    userNameStore.loginComplete();
    modalDispatch('close_login');
    buttonModeDispatch('complete_login');
  };

  const handleConfirmModalButtonClick = async (type: 'Y' | 'N') => {
    if (type === 'Y') {
      modalDispatch('close_confirm');
      modalDispatch('close_login');
      await fetchUserAvailableTime();
      userNameStore.loginComplete();
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
      userAvailabilityStore.setState((prev) => ({ ...prev, selectedTimes: currentTimes }));
      // 추후ㅜ 수정되어야함. 묶어야한다. 위에 2개
      await handleUserAvailabilitySubmit();
      pageReset();
      showToast({
        type: 'success',
        message: '시간표 저장이 완료되었습니다!',
      });

      // 저장 응답을 받은 뒤에 세운다. 이 시점 이후의 어떤 갱신이든 내 저장을 포함하므로,
      // 다음 SSE 로 히트맵을 다시 불러온 순간에 플립하면 화면과 버튼이 어긋나지 않는다.
      awaitingSaveRef.current = true;
    } else if (buttonMode === 'edit') {
      buttonModeDispatch('click_edit');
    }
  };

  // SSE 신호에는 누가 바꿨는지가 없다. 내 저장을 기다리는 중일 때만 플립한다.
  const completeSaveIfAwaiting = useCallback(() => {
    if (!awaitingSaveRef.current) return;
    awaitingSaveRef.current = false;
    buttonModeDispatch('click_save');
  }, []);

  return {
    buttonMode,
    buttonName: BUTTON_NAME[buttonMode],
    modal,
    handleButtonClick,
    completeSaveIfAwaiting,
    handleLoginModalButtonClick,
    handleConfirmModalButtonClick,
    handleModalClick,
  };
};

export default useCheckEventHandlers;
