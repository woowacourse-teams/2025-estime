import { useCallback, useEffect, useRef, useState } from 'react';

const useSectionValidation = (isCalendarReady: boolean, isBasicReady: boolean) => {
  const showValidation = useRef(false);
  const [shouldShake, setShouldShake] = useState(false);

  const validateSection = useCallback(() => {
    showValidation.current = true;

    if (!isCalendarReady) {
      setShouldShake(true);
      return false;
    }
    if (!isBasicReady) {
      setShouldShake(true);
      return false;
    }
    return true;
  }, [isCalendarReady, isBasicReady]);

  useEffect(() => {
    if (shouldShake) {
      const timer = setTimeout(() => {
        setShouldShake(false);
      }, 460);

      return () => clearTimeout(timer);
    }
  }, [shouldShake]);

  return {
    showValidation,
    shouldShake,
    validateSection,
  };
};

export default useSectionValidation;
