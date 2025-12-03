interface EditFlowParams {
  onComplete: () => void;
}

const useEditFlow = ({ onComplete }: EditFlowParams) => {
  const execute = () => {
    onComplete();
  };

  return {
    label: '수정하기',
    execute,
  };
};

export default useEditFlow;
