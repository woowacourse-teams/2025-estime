import type { CreateUserResponseType } from '@/apis/room/type';
import type { ModalControls } from '@/shared/hooks/Modal/useModalControl';
import { userNameStore } from '../../stores/userNameStore';
interface RegisterFlowDeps {
  performLogin: () => Promise<CreateUserResponseType>;
  onComplete: () => void;
  loadUserAvailability: () => Promise<void>;
  loginModal: ModalControls;
  confirmModal: ModalControls;
}

const useRegisterFlow = ({
  performLogin,
  loadUserAvailability,
  onComplete,
  loginModal,
  confirmModal,
}: RegisterFlowDeps) => {
  const execute = () => {
    loginModal.open();
  };

  const handleLoginSubmit = async () => {
    const data = await performLogin();

    if (data.isDuplicateName) {
      confirmModal.open();
      return;
    }

    await loadUserAvailability();
    userNameStore.loginComplete();
    loginModal.close();
    onComplete();
  };

  const handleConfirmResponse = async () => {
    confirmModal.close();
    loginModal.close();
    await loadUserAvailability();
    userNameStore.loginComplete();
    onComplete();
  };

  return {
    execute,
    handleLoginSubmit,
    handleConfirmResponse,
  };
};

export default useRegisterFlow;
