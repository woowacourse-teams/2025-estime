import { CreateUserResponseType } from '@/apis/room/type';
import { userNameStore } from '../../stores/userNameStore';

interface RegisterFlowDeps {
  handleLogin: () => Promise<CreateUserResponseType>;
  fetchUserAvailableTime: () => Promise<void>;
  openLogin: () => void;
  closeLogin: () => void;
  openConfirm: () => void;
  closeConfirm: () => void;
  onComplete: () => void;
}

const useRegisterFlow = ({
  handleLogin,
  fetchUserAvailableTime,
  openLogin,
  closeLogin,
  openConfirm,
  closeConfirm,
  onComplete,
}: RegisterFlowDeps) => {
  const execute = () => {
    openLogin();
  };

  const handleLoginSubmit = async () => {
    const data = await handleLogin();

    if (data.isDuplicateName) {
      openConfirm();
      return;
    }

    await fetchUserAvailableTime();
    userNameStore.loginComplete();
    closeLogin();
    onComplete();
  };

  const handleConfirmResponse = async (type: 'Y' | 'N') => {
    if (type === 'Y') {
      closeConfirm();
      closeLogin();
      await fetchUserAvailableTime();
      userNameStore.loginComplete();
      onComplete();
    } else {
      closeConfirm();
    }
  };

  return {
    label: '등록하기',
    execute,
    handleLoginSubmit,
    handleConfirmResponse,
  };
};

export default useRegisterFlow;
