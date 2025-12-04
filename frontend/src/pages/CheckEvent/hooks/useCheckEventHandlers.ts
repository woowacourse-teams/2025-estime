import { useState } from 'react';
import type { CreateUserResponseType } from '@/apis/room/type';
import type { updateUserAvailableTimeType } from '@/apis/time/type';
import type { ModalHelperType } from '@/shared/hooks/Modal/useModalControl';
import useRegisterFlow from './Flows/useRegisterFlow';
import useSaveFlow from './Flows/useSaveFlow';
import useEditFlow from './Flows/useEditFlow';

export type FlowMode = 'register' | 'save' | 'edit';

interface CheckEventHandlersParams {
  loadUserAvailability: () => Promise<void>;
  performLogin: () => Promise<CreateUserResponseType>;
  performUserSubmit: () => Promise<updateUserAvailableTimeType | undefined>;
  pageReset: () => void;
  modalHelpers: ModalHelperType;
}

type FlowStrategy = {
  execute: () => Promise<void> | void;
};

const useCheckEventHandlers = ({
  loadUserAvailability,
  performLogin,
  performUserSubmit,
  pageReset,
  modalHelpers,
}: CheckEventHandlersParams) => {
  const [mode, setMode] = useState<FlowMode>('register');

  const { login, confirm } = modalHelpers;

  const registerFlow = useRegisterFlow({
    loginModal: login,
    confirmModal: confirm,
    performLogin,
    loadUserAvailability,
    onComplete: () => setMode('save'),
  });

  const saveFlow = useSaveFlow({
    performUserSubmit,
    pageReset,
    onComplete: () => setMode('edit'),
  });

  const editFlow = useEditFlow({
    onComplete: () => setMode('save'),
  });

  const flowStrategies: Record<FlowMode, FlowStrategy> = {
    register: registerFlow,
    save: saveFlow,
    edit: editFlow,
  };

  const currentStrategy = flowStrategies[mode];

  return {
    buttonMode: mode,
    handleButtonClick: currentStrategy.execute,
    handleLogin: registerFlow.handleLoginSubmit,
    handleConfirm: registerFlow.handleConfirmResponse,
  };
};

export default useCheckEventHandlers;
