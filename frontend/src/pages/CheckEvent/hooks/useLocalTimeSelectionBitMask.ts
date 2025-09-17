import { useRef, useCallback, useState, useEffect } from 'react';
import { useLockBodyScroll } from '../../../shared/hooks/common/useLockBodyScroll';
import { useTimeSelectionContext } from '../contexts/TimeSelectionContext';

interface UseLocalTimeSelectionOptions {
  initialSelectedTimes: Set<string>;
}

type TimeSnapPoint = {
  dateTime: string;
  left: number;
  right: number;
  top: number;
  bottom: number;
};

// 비트마스크 유틸리티 클래스 - Set 연산 최적화용
class BitMaskSet {
  private masks: Uint32Array;
  private timeToIndex: Map<string, number>;
  private indexToTime: string[];

  constructor(availableTimes: string[]) {
    // 32비트 단위로 저장
    this.masks = new Uint32Array(Math.ceil(availableTimes.length / 32));
    this.timeToIndex = new Map();
    this.indexToTime = availableTimes;

    availableTimes.forEach((time, index) => {
      this.timeToIndex.set(time, index);
    });
  }

  // Set에서 비트마스크로 변환
  fromSet(set: Set<string>): void {
    this.masks.fill(0);
    set.forEach((time) => {
      const index = this.timeToIndex.get(time);
      if (index !== undefined) {
        const arrayIndex = Math.floor(index / 32);
        const bitPosition = index % 32;
        this.masks[arrayIndex] |= 1 << bitPosition;
      }
    });
  }

  // 비트마스크를 Set으로 변환
  toSet(): Set<string> {
    const result = new Set<string>();

    for (let i = 0; i < this.masks.length; i++) {
      if (this.masks[i] === 0) continue; // 빈 마스크는 스킵

      let mask = this.masks[i];
      let bitIndex = 0;

      while (mask) {
        if (mask & 1) {
          const globalIndex = i * 32 + bitIndex;
          if (globalIndex < this.indexToTime.length) {
            result.add(this.indexToTime[globalIndex]);
          }
        }
        mask >>>= 1;
        bitIndex++;
      }
    }

    return result;
  }

  // 특정 시간이 설정되어 있는지 확인
  has(time: string): boolean {
    const index = this.timeToIndex.get(time);
    if (index === undefined) return false;

    const arrayIndex = Math.floor(index / 32);
    const bitPosition = index % 32;

    return (this.masks[arrayIndex] & (1 << bitPosition)) !== 0;
  }

  // 특정 시간 추가
  add(time: string): void {
    const index = this.timeToIndex.get(time);
    if (index === undefined) return;

    const arrayIndex = Math.floor(index / 32);
    const bitPosition = index % 32;

    this.masks[arrayIndex] |= 1 << bitPosition;
  }

  // 특정 시간 제거
  delete(time: string): void {
    const index = this.timeToIndex.get(time);
    if (index === undefined) return;

    const arrayIndex = Math.floor(index / 32);
    const bitPosition = index % 32;

    this.masks[arrayIndex] &= ~(1 << bitPosition);
  }

  // 복사본 생성
  clone(): BitMaskSet {
    const cloned = Object.create(BitMaskSet.prototype);
    cloned.masks = new Uint32Array(this.masks);
    cloned.timeToIndex = this.timeToIndex;
    cloned.indexToTime = this.indexToTime;
    return cloned;
  }
}

const useLocalTimeSelection = ({ initialSelectedTimes }: UseLocalTimeSelectionOptions) => {
  const { updateCurrentSelectedTimes } = useTimeSelectionContext();

  // 비트마스크 헬퍼 (선택사항 - 성능이 중요한 경우에만 사용)
  const bitMaskHelperRef = useRef<BitMaskSet | null>(null);
  const useBitMask = useRef(false); // 비트마스크 사용 여부

  // 렌더 트리거용(부모·자식 렌더는 이 값으로만 결정)
  const [localSelectedTimes, setLocalSelectedTimes] = useState<Set<string>>(
    () => new Set(initialSelectedTimes)
  );

  // 임계영역에 접근하기 위한 ref - 기존 Set 방식 유지
  const currentWorkingSetRef = useRef<Set<string>>(new Set(initialSelectedTimes));

  const containerRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef(false);
  const [isTouch, setIsTouch] = useState(false);

  const dragStartX = useRef(0);
  const dragStartY = useRef(0);
  const selectionModeRef = useRef<'add' | 'remove'>('add');

  // 스냅샷
  const containerBoundingRectRef = useRef<DOMRectReadOnly | null>(null);
  const timeSnapPointsRef = useRef<TimeSnapPoint[]>([]);

  // 배치(rAF)
  const renderAnimationFrameId = useRef<number | null>(null);

  const triggerRenderUpdate = () => {
    if (renderAnimationFrameId.current != null) return;
    renderAnimationFrameId.current = requestAnimationFrame(() => {
      renderAnimationFrameId.current = null;

      // 비트마스크 사용 시 변환, 아니면 그대로 사용
      if (useBitMask.current && bitMaskHelperRef.current) {
        bitMaskHelperRef.current.fromSet(currentWorkingSetRef.current);
        setLocalSelectedTimes(bitMaskHelperRef.current.toSet());
      } else {
        setLocalSelectedTimes(new Set(currentWorkingSetRef.current));
      }
    });
  };

  useLockBodyScroll(isTouch);

  // 비트마스크 초기화 (선택사항)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const times: string[] = [];
    container.querySelectorAll<HTMLElement>('.selectable').forEach((element) => {
      const time = element.getAttribute('data-time');
      if (time) times.push(time);
    });

    // 시간 슬롯이 많을 때만 비트마스크 사용 (예: 100개 이상)
    if (times.length > 100) {
      bitMaskHelperRef.current = new BitMaskSet(times);
      bitMaskHelperRef.current.fromSet(initialSelectedTimes);
      useBitMask.current = true;
    }
  }, []);

  useEffect(() => {
    if (isDraggingRef.current) return;
    const nextSelectedTimes = new Set(initialSelectedTimes);
    currentWorkingSetRef.current = new Set(nextSelectedTimes);
    setLocalSelectedTimes(nextSelectedTimes);

    // 비트마스크도 업데이트
    if (useBitMask.current && bitMaskHelperRef.current) {
      bitMaskHelperRef.current.fromSet(nextSelectedTimes);
    }
  }, [initialSelectedTimes]);

  const measureTimeTableContainer = () => {
    const container = containerRef.current;
    if (!container) return;
    const containerRect = container.getBoundingClientRect();
    containerBoundingRectRef.current = containerRect;

    const snapPoints: TimeSnapPoint[] = [];

    container.querySelectorAll<HTMLElement>('.selectable').forEach((selectableElement) => {
      const dateTime = selectableElement.getAttribute('data-time');
      if (!dateTime) return;
      const elementRect = selectableElement.getBoundingClientRect();
      snapPoints.push({
        dateTime,
        left: elementRect.left - containerRect.left,
        right: elementRect.right - containerRect.left,
        top: elementRect.top - containerRect.top,
        bottom: elementRect.bottom - containerRect.top,
      });
    });
    timeSnapPointsRef.current = snapPoints;
  };

  const handleDragStart = useCallback((event: React.PointerEvent) => {
    isDraggingRef.current = true;
    setIsTouch(event.pointerType === 'touch');
    measureTimeTableContainer();

    const containerRect = containerBoundingRectRef.current;
    if (!containerRect) return;

    // 컨테이너 기준 좌표 보정
    dragStartX.current = event.clientX - containerRect.left;
    dragStartY.current = event.clientY - containerRect.top;

    // 1.요소 조회
    const targetElement = (event.target as HTMLElement).closest(
      '.selectable'
    ) as HTMLElement | null;
    const targetTimeValue = targetElement?.getAttribute('data-time');
    if (!targetTimeValue) return;

    // 2.드래그 모드 변경 - 비트마스크 사용 시 최적화된 has 연산
    if (useBitMask.current && bitMaskHelperRef.current) {
      selectionModeRef.current = bitMaskHelperRef.current.has(targetTimeValue) ? 'remove' : 'add';

      // 3.현재 요소 토글
      if (selectionModeRef.current === 'add') {
        bitMaskHelperRef.current.add(targetTimeValue);
        currentWorkingSetRef.current.add(targetTimeValue);
      } else {
        bitMaskHelperRef.current.delete(targetTimeValue);
        currentWorkingSetRef.current.delete(targetTimeValue);
      }
    } else {
      // 기존 Set 방식
      selectionModeRef.current = currentWorkingSetRef.current.has(targetTimeValue)
        ? 'remove'
        : 'add';

      if (selectionModeRef.current === 'add') {
        currentWorkingSetRef.current.add(targetTimeValue);
      } else {
        currentWorkingSetRef.current.delete(targetTimeValue);
      }
    }

    triggerRenderUpdate();
  }, []);

  const handleDragMove = useCallback((event: React.PointerEvent) => {
    if (!isDraggingRef.current) return;

    const containerRect = containerBoundingRectRef.current;
    if (!containerRect) return;

    const currentX = event.clientX - containerRect.left;
    const currentY = event.clientY - containerRect.top;

    const selectionAreaMinX = Math.min(dragStartX.current, currentX);
    const selectionAreaMinY = Math.min(dragStartY.current, currentY);
    const selectionAreaMaxX = Math.max(dragStartX.current, currentX);
    const selectionAreaMaxY = Math.max(dragStartY.current, currentY);

    let hasChanges = false;

    for (const snapPoint of timeSnapPointsRef.current) {
      const isInSelectionArea =
        snapPoint.left < selectionAreaMaxX &&
        snapPoint.right > selectionAreaMinX &&
        snapPoint.top < selectionAreaMaxY &&
        snapPoint.bottom > selectionAreaMinY;
      if (!isInSelectionArea) continue;

      // 비트마스크와 Set 동시 업데이트
      if (useBitMask.current && bitMaskHelperRef.current) {
        if (selectionModeRef.current === 'add') {
          if (!bitMaskHelperRef.current.has(snapPoint.dateTime)) {
            hasChanges = true;
            bitMaskHelperRef.current.add(snapPoint.dateTime);
            currentWorkingSetRef.current.add(snapPoint.dateTime);
          }
        } else {
          if (bitMaskHelperRef.current.has(snapPoint.dateTime)) {
            hasChanges = true;
            bitMaskHelperRef.current.delete(snapPoint.dateTime);
            currentWorkingSetRef.current.delete(snapPoint.dateTime);
          }
        }
      } else {
        // 기존 Set 방식
        if (selectionModeRef.current === 'add') {
          if (!currentWorkingSetRef.current.has(snapPoint.dateTime)) {
            hasChanges = true;
            currentWorkingSetRef.current.add(snapPoint.dateTime);
          }
        } else {
          if (currentWorkingSetRef.current.has(snapPoint.dateTime)) {
            hasChanges = true;
            currentWorkingSetRef.current.delete(snapPoint.dateTime);
          }
        }
      }
    }

    if (hasChanges) triggerRenderUpdate();
  }, []);

  const resetDragState = useCallback(() => {
    isDraggingRef.current = false;
    timeSnapPointsRef.current = [];
    containerBoundingRectRef.current = null;
    setIsTouch(false);
  }, []);

  const handleDragEnd = useCallback(() => {
    if (!isDraggingRef.current) return;

    resetDragState();

    const finalSelectedTimes = new Set(currentWorkingSetRef.current);

    triggerRenderUpdate();
    updateCurrentSelectedTimes(finalSelectedTimes);
  }, [updateCurrentSelectedTimes, resetDragState]);

  return {
    containerRef,
    localSelectedTimes,
    pointerHandlers: {
      onPointerDown: handleDragStart,
      onPointerMove: handleDragMove,
      onPointerUp: handleDragEnd,
      onPointerLeave: handleDragEnd,
    },
  };
};

export default useLocalTimeSelection;
