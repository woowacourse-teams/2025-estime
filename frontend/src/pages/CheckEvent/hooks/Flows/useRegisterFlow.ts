import type { CreateUserResponseType } from '@/apis/room/type';
import { userNameStore } from '../../stores/userNameStore';
import type { ModalHelperType } from '@/shared/hooks/Modal/useModalControl';

interface RegisterFlowDeps {
  performLogin: () => Promise<CreateUserResponseType>;
  onComplete: () => void;
  loadUserAvailability: () => Promise<void>;
  modalHelpers: ModalHelperType;
}

const useRegisterFlow = ({
  performLogin,
  loadUserAvailability,
  onComplete,
  modalHelpers,
}: RegisterFlowDeps) => {
  const { login, confirm } = modalHelpers;
  const execute = () => {
    login.open();
  };

  const handleLoginSubmit = async () => {
    const data = await performLogin();

    if (data.isDuplicateName) {
      confirm.open();
      return;
    }

    await loadUserAvailability();
    userNameStore.loginComplete();
    login.close();
    onComplete();
  };

  const handleConfirmResponse = async () => {
    confirm.close();
    login.close();
    await loadUserAvailability();
    userNameStore.loginComplete();
    onComplete();
  };

  return {
    label: '등록하기',
    execute,
    handleLoginSubmit,
    handleConfirmResponse,
  };
};

export default useRegisterFlow;
