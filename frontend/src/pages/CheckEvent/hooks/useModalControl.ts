import { useReducer, useCallback } from 'react';

type ModalState = {
  login: boolean;
  entryConfirm: boolean;
  copyLink: boolean;
};

type ModalAction =
  | 'open_login'
  | 'close_login'
  | 'open_confirm'
  | 'close_confirm'
  | 'open_copylink'
  | 'close_copylink';

const initialModalState: ModalState = {
  login: false,
  entryConfirm: false,
  copyLink: false,
};

const modalReducer = (state: ModalState, action: ModalAction): ModalState => {
  switch (action) {
    case 'open_login':
      return { ...state, login: true };
    case 'close_login':
      return { ...state, login: false };
    case 'open_confirm':
      return { ...state, entryConfirm: true };
    case 'close_confirm':
      return { ...state, entryConfirm: false };
    case 'open_copylink':
      return { ...state, copyLink: true };
    case 'close_copylink':
      return { ...state, copyLink: false };
    default:
      return state;
  }
};

/**
 * 모달 상태 관리 훅
 * - 모든 Flow에서 공유되는 모달 상태를 관리
 * - copyLink는 버튼 모드와 무관하게 헤더에서 열림
 * - login, entryConfirm은 RegisterFlow에서 사용
 */
const useModalControl = () => {
  const [modal, dispatch] = useReducer(modalReducer, initialModalState);

  const openLogin = useCallback(() => dispatch('open_login'), []);
  const closeLogin = useCallback(() => dispatch('close_login'), []);
  const openConfirm = useCallback(() => dispatch('open_confirm'), []);
  const closeConfirm = useCallback(() => dispatch('close_confirm'), []);
  const openCopyLink = useCallback(() => dispatch('open_copylink'), []);
  const closeCopyLink = useCallback(() => dispatch('close_copylink'), []);

  return {
    modal,
    openLogin,
    closeLogin,
    openConfirm,
    closeConfirm,
    openCopyLink,
    closeCopyLink,
  };
};

export default useModalControl;
