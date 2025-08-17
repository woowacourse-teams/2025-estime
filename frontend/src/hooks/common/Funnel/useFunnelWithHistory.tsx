import { useCallback } from 'react';
import useFunnel from './useFunnel';
import useFunnelHistory from './useFunnelHistory';

const useFunnelWithHistory = <S extends readonly string[]>(steps: S) => {
  type T = S[number];
  const stepsMutable = [...steps];

  const { Funnel, step, setStep, next } = useFunnel<T>(stepsMutable);
  const navigateToStep = useFunnelHistory(step, setStep);

  const stepNext = useCallback(() => {
    // funnel 변경
    next();

    // history 축적
    const current = steps.indexOf(step);
    const nextStep = steps[current + 1];
    navigateToStep(nextStep);
  }, [next, navigateToStep, step, steps]);

  const stepPrev = useCallback(() => {
    // prev 함수를 사용할 필요가 없음.
    // 크롬의 뒤로가기 버튼에 현재 funnel의 동작을 넣어놨기 때문에, 그것에 맞는 행동을 시키면 동일하게 동작
    window.history.back();
  }, []);

  return { Funnel, step, stepNext, stepPrev };
};

export default useFunnelWithHistory;
