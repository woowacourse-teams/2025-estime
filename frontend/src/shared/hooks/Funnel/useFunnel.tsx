import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

const useFunnel = <T extends string>(initialSteps: T[]) => {
  const [step, setStep] = useState<T>(initialSteps[0]);

  const indexMap = useMemo(() => {
    const m = new Map<T, number>();
    initialSteps.forEach((s, i) => m.set(s, i));
    return m;
  }, [initialSteps]);

  const prev = useCallback(() => {
    setStep((prev) => {
      const idx = indexMap.get(prev)!;
      return initialSteps[idx - 1];
    });
  }, [indexMap, initialSteps]);

  const next = useCallback(() => {
    setStep((prev) => {
      const idx = indexMap.get(prev)!;
      return initialSteps[idx + 1];
    });
  }, [indexMap, initialSteps]);

  const Funnel = useMemo(() => createFunnelComponents<T>(), []);

  return { Funnel, step, setStep, next, prev };
};

export default useFunnel;

const createFunnelComponents = <T extends string>() => {
  const StepContext = createContext<T | null>(null);

  const Funnel = ({ step, children }: { step: T; children: React.ReactNode }) => {
    return <StepContext.Provider value={step}>{children}</StepContext.Provider>;
  };

  Funnel.Step = function Content({ name, children }: { name: T; children: React.ReactNode }) {
    const step = useContext(StepContext);
    if (step == null) throw new Error('Funnel.Step는 <Funnel> 내부에서 사용해야한다.');
    return step === name ? children : null;
  };
  return Funnel;
};
