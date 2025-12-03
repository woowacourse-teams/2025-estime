interface EditFlowDeps {
  onComplete: () => void;
}

const useEditFlow = ({ onComplete }: EditFlowDeps) => {
  const execute = () => {
    onComplete();
  };

  return {
    label: '수정하기',
    execute,
  };
};

export default useEditFlow;
