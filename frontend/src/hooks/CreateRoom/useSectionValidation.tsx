import { useCallback, useRef, useState } from 'react';

type SectionState = 'calendar' | 'basic' | 'ready';

const useSectionValidation = (isReadyToCreateRoom: () => SectionState) => {
  const [invalidSection, setInvalidSection] = useState<SectionState>('ready');

  const CalendarRef = useRef<HTMLDivElement | null>(null);
  const BasicSettingsRef = useRef<HTMLDivElement | null>(null);

  const validateSection = useCallback(() => {
    const status = isReadyToCreateRoom();
    if (status !== 'ready') {
      setInvalidSection(status);
      if (status === 'calendar') CalendarRef.current?.scrollIntoView({ behavior: 'smooth' });
      if (status === 'basic') BasicSettingsRef.current?.scrollIntoView({ behavior: 'smooth' });
      return false;
    }
    return true;
  }, [isReadyToCreateRoom]);

  const handleSectionChange = useCallback(() => {
    const status = isReadyToCreateRoom();
    if (invalidSection !== status) {
      setInvalidSection('ready');
    }
  }, [invalidSection, isReadyToCreateRoom]);

  return {
    CalendarRef,
    BasicSettingsRef,
    invalidSection,
    validateSection,
    handleSectionChange,
  };
};

export default useSectionValidation;
