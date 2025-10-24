import { useReducer } from 'react';
import modeReducer from '../reducers/modeReducer';
import { ModalAction, modalReducer } from '../reducers/modalReducer';
import { CreateUserResponseType } from '@/apis/room/type';
import { updateUserAvailableTimeType } from '@/apis/time/type';
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
  //   const

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

      // 전역 스토어같은 곳에서 이벤트를 전달 받는다.
      // sse 단에서 새로운 매시지가 올떄가 대기한다.
      //임시로 설정

      // 현재 문제상황 :
      // 사용자가 자신의 셀을 선택한 후, 반영하면 저장하기 api는 가지만, 플립이 늦어짐.$

      // 해결 방안
      // 사용자가 저장 버튼 클릭 → 서버로 저장 요청
      // 서버에서 SSE 메시지 브로드캐스트 → 클라이언트 수신
      // SSE 핸들러에서 userAvailabilityStore.setState(...) 호출 → 전역 store 업데이트
      // 그 순간 "flip" (예: buttonModeDispatch('click_save')) 실행하고 싶다
      setTimeout(() => {
        buttonModeDispatch('click_save');
      }, 200);
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
