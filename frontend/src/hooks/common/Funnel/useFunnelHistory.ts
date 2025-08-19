import { useCallback, useEffect, useRef } from 'react';

interface HistoryState<T> {
  funnelStep: T;
}

const useFunnelHistory = <T extends string>(currentStep: T, updateStep: (step: T) => void) => {
  const currentStepRef = useRef(currentStep);
  const updateStepRef = useRef(updateStep);

  // 초기에 현재 퍼널을 넣는다.
  useEffect(() => {
    const historyState: HistoryState<T> = {
      funnelStep: currentStepRef.current,
    };
    window.history.replaceState(historyState, '', window.location.href);
  }, []);

  // 브라우저 뒤로가기/앞으로가기 처리
  useEffect(() => {
    const handleBrowserNavigation = (event: PopStateEvent) => {
      const historyState = event.state as HistoryState<T>;

      if (historyState?.funnelStep) {
        updateStepRef.current(historyState.funnelStep);
      }
    };

    window.addEventListener('popstate', handleBrowserNavigation);
    return () => window.removeEventListener('popstate', handleBrowserNavigation);
  }, []);

  // 다음 스텝으로 이동 (히스토리에 새 항목 추가)
  const navigateToStep = useCallback((nextStep: T) => {
    const historyState: HistoryState<T> = {
      funnelStep: nextStep,
    };
    window.history.pushState(historyState, '', window.location.href);
  }, []);

  return navigateToStep;
};

export default useFunnelHistory;
