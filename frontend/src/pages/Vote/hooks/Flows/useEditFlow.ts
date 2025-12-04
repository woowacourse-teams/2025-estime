interface EditFlowParams {
  onComplete: () => void;
}

const useEditFlow = ({ onComplete }: EditFlowParams) => {
  const execute = () => {
    onComplete();
  };

  return {
    execute,
  };
};

export default useEditFlow;
