import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

export const useFunnel = <T extends string>(steps: T[]) => {
  const [i, setI] = useState(0);
  const step = steps[i];

  const prev = useCallback(() => {
    setI((prev) => prev - 1);
  }, [i]);

  const next = useCallback(() => {
    setI((prev) => prev + 1);
  }, [i]);

  const Funnel = useMemo(() => createFunnelComponents<T>(), []);

  return { Funnel, step, next, prev };
};

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
