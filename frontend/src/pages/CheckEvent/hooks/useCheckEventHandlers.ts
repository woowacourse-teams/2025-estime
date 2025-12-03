import { useState } from 'react';
import { CreateUserResponseType } from '@/apis/room/type';
import { updateUserAvailableTimeType } from '@/apis/time/type';
import useModalControl from './useModalControl';
import useRegisterFlow from './Flows/useRegisterFlow';
import useSaveFlow from './Flows/useSaveFlow';
import useEditFlow from './Flows/useEditFlow';

export type FlowMode = 'register' | 'save' | 'edit';

interface CheckEventHandlersDeps {
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
}: CheckEventHandlersDeps) => {
  const [mode, setMode] = useState<FlowMode>('register');

  const modalControl = useModalControl();

  const registerFlow = useRegisterFlow({
    handleLogin,
    fetchUserAvailableTime,
    openLogin: modalControl.openLogin,
    closeLogin: modalControl.closeLogin,
    openConfirm: modalControl.openConfirm,
    closeConfirm: modalControl.closeConfirm,
    onComplete: () => setMode('save'),
  });

  const saveFlow = useSaveFlow({
    handleUserAvailabilitySubmit,
    pageReset,
    onComplete: () => setMode('edit'),
  });

  const editFlow = useEditFlow({
    onComplete: () => setMode('save'),
  });

  const flowStrategies = {
    register: registerFlow,
    save: saveFlow,
    edit: editFlow,
  };

  const currentStrategy = flowStrategies[mode];

  return {
    buttonMode: mode,
    buttonName: currentStrategy.label,

    modalControl,

    handleButtonClick: currentStrategy.execute,
    handleLoginModalButtonClick: registerFlow.handleLoginSubmit,
    handleConfirmModalButtonClick: registerFlow.handleConfirmResponse,
  };
};

export default useCheckEventHandlers;
