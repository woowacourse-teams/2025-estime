import { RefObject, useEffect, useRef } from 'react';

interface columnsPerPageProps {
  containerRef: RefObject<HTMLDivElement | null>;
  timeColumnRef: RefObject<HTMLDivElement | null>;
  minColumnWidth: number;
}

export function useColumnsPerPage({
  containerRef,
  timeColumnRef,
  minColumnWidth,
}: columnsPerPageProps) {
  const maxColumnCountPerPageRef = useRef(0);

  useEffect(() => {
    if (!containerRef.current || !timeColumnRef.current) return;

    const containerWidth = containerRef.current.getBoundingClientRect().width;
    const style = getComputedStyle(containerRef.current);
    const containerWidthWithoutPadding =
      containerWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);

    const timeColumnWidth = timeColumnRef.current.getBoundingClientRect().width;

    maxColumnCountPerPageRef.current = Math.floor(
      (containerWidthWithoutPadding - timeColumnWidth) / minColumnWidth
    );
  }, [minColumnWidth]);

  return maxColumnCountPerPageRef.current;
}
