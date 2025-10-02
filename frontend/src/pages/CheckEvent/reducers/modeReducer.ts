// register - save - edit

type ButtonMode = 'register' | 'save' | 'edit';
type Action = 'complete_login' | 'click_save' | 'click_edit';

const modeReducer = (buttonMode: ButtonMode, action: Action) => {
  switch (action) {
    // 로그인 성공 시 ->  버튼 상태 - '저장하기'
    case 'complete_login':
      return 'save';
    // '저장하기' 버튼 클릭 시 -> 버튼 상태 - '편집하기'
    case 'click_save':
      return 'edit';
    // '수정하기' 버튼 클릭 시 -> 버튼 상태 - '저장하기'
    case 'click_edit':
      return 'save';
    default:
      return buttonMode;
  }
};

export default modeReducer;
