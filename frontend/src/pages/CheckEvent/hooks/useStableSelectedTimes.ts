import { useMemo, useRef } from 'react';

/**
 * Set 객체의 참조 안정성을 확보하는 훅
 * Set의 내용이 실제로 변경되었을 때만 새로운 Set 객체를 반환
 */
export const useStableSelectedTimes = (selectedTimes: Set<string>) => {
  const prevSetRef = useRef<Set<string>>(selectedTimes);
  const prevArrayRef = useRef<string[]>(Array.from(selectedTimes));

  return useMemo(() => {
    const currentArray = Array.from(selectedTimes);

    // 배열 길이가 다르면 변경됨
    if (currentArray.length !== prevArrayRef.current.length) {
      prevArrayRef.current = currentArray;
      prevSetRef.current = new Set(currentArray);
      return prevSetRef.current;
    }

    // 배열 내용이 다르면 변경됨
    const hasChanged = currentArray.some((item, index) => item !== prevArrayRef.current[index]);

    if (hasChanged) {
      prevArrayRef.current = currentArray;
      prevSetRef.current = new Set(currentArray);
      return prevSetRef.current;
    }

    // 변경되지 않았으면 이전 Set 객체 반환 (참조 유지)
    return prevSetRef.current;
  }, [selectedTimes]);
};
