// register - save - edit

type ModalState = {
  login: boolean;
  entryConfirm: boolean;
  copyLink: boolean;
};

export type ModalAction =
  | 'open_login'
  | 'close_login'
  | 'open_confirm'
  | 'close_confirm'
  | 'open_copylink'
  | 'close_copylink';

export const modalReducer = (state: ModalState, action: ModalAction): ModalState => {
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
