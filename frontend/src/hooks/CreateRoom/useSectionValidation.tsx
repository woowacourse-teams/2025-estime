import { useCallback, useEffect, useRef, useState } from 'react';

const useSectionValidation = (isCalendarReady: boolean, isBasicReady: boolean) => {
  const CalendarRef = useRef<HTMLDivElement | null>(null);
  const BasicSettingsRef = useRef<HTMLDivElement | null>(null);

  const [showValidation, setShowValidation] = useState(true);
  const [shouldShake, setShouldShake] = useState(false);

  const validateSection = useCallback(() => {
    setShowValidation(false);

    if (!isCalendarReady) {
      // CalendarRef.current?.focus();
      setShouldShake(true);
      return false;
    }
    if (!isBasicReady) {
      // BasicSettingsRef.current?.focus();
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
    CalendarRef,
    BasicSettingsRef,
    showValidation,
    shouldShake,
    validateSection,
  };
};

export default useSectionValidation;
