import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

const useFunnel = <T extends string>(steps: T[]) => {
  const [i, setI] = useState(0); // 숫자로 할까 내부 리얼 값으로 할까? 고민
  const step = steps[i];

  const prev = useCallback(() => {
    setI((prev) => prev - 1);
  }, [i]);

  const next = useCallback(() => {
    setI((prev) => prev + 1);
  }, [i]);

  const setStep = useCallback(
    (step: T) => {
      const idx = steps.indexOf(step);
      if (idx !== -1) setI(idx);
    },
    [steps]
  );

  const Funnel = useMemo(() => createFunnelComponents<T>(), []);

  return { Funnel, step, setStep, next, prev };
};

export default useFunnel;

const createFunnelComponents = <T extends string>() => {
  const StepContext = createContext<T | null>(null);

  const Funnel = ({ step, children }: { step: T; children: React.ReactNode }) => {
    return <StepContext.Provider value={step}>{children}</StepContext.Provider>;
  };

  Funnel.Step = function Content({ step, children }: { step: T; children: React.ReactNode }) {
    const current = useContext(StepContext);
    if (current == null) throw new Error('Funnel.Content는 <Funnel> 내부에서 사용해야한다.');
    return current === step ? children : null;
  };
  return Funnel;
};
