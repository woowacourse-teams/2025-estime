import { useCallback, useEffect, useRef } from 'react';

const useFunnelHistory = <T extends string>(step: T, setStep: (step: T) => void) => {
  const stepRef = useRef(step);
  const setStepRef = useRef(setStep);

  // 초기에 현재 퍼널을 넣는다.
  useEffect(() => {
    const state = { funnelStep: stepRef.current };
    window.history.replaceState(state, '', window.location.href);
  }, []);

  // popstate 리스너 -> 이게 돌려면 뒤로가기 버튼(크롬 탭의)을 누르면 최신값이 나가게 되고, 현재 남은 event가 funnel을 차지하게 된다.
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const state = event.state as { funnelStep: T };
      setStepRef.current(state.funnelStep);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // 앞으로 퍼널을 이동하게 되면 새 스텝을 push
  const pushStep = useCallback((nextStep: T) => {
    window.history.pushState({ funnelStep: nextStep }, '', window.location.href);
  }, []);

  return pushStep;
};

export default useFunnelHistory;
