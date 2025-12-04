import { useState } from 'react';
import { CreateUserResponseType } from '@/apis/room/type';
import { updateUserAvailableTimeType } from '@/apis/time/type';
import useRegisterFlow from './Flows/useRegisterFlow';
import useSaveFlow from './Flows/useSaveFlow';
import useEditFlow from './Flows/useEditFlow';
import type { ModalHelperType } from '@/shared/hooks/Modal/useModalControl';

export type FlowMode = 'register' | 'save' | 'edit';

type FlowStrategy = {
  execute: () => Promise<void> | void;
};

interface VotePageHandlersParams {
  loadUserAvailability: () => Promise<void>;
  performLogin: () => Promise<CreateUserResponseType>;
  performUserSubmit: () => Promise<updateUserAvailableTimeType | undefined>;
  pageReset: () => void;
  modalHelpers: ModalHelperType;
}

const useVotePageHandlers = ({
  loadUserAvailability,
  performLogin,
  performUserSubmit,
  pageReset,
  modalHelpers,
}: VotePageHandlersParams) => {
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

export default useVotePageHandlers;
