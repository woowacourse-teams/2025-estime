import { useRef, useCallback, useMemo, useEffect } from 'react';
import { useUserAvailability, userAvailabilityStore } from '../stores/userAvailabilityStore';

import {
  type SelectionMode,
  type TimeCellHitbox,
  type Point,
  getCellKeyFromEvent,
  getContainerBounds,
  toLocalPoint,
  populateHitboxes,
  makeRectFromPoints,
  decideEditMode,
  sweepSelection,
  createRafBatch,
  setDraggingClass,
  syncCellClasses,
} from '@/pages/CheckEvent/utils/timeSelectionUtils';
import usePreventScroll from './usePreventScroll';

const useLocalTimeSelection = () => {
  const selectedTimes = useUserAvailability().selectedTimes;

  // 작업 중인 선택 셀 집합을 ref로 관리
  const workingSetRef = useRef<Set<string>>(new Set(selectedTimes));

  // 컨테이너와 레이아웃 ref
  // 컨테이너 안쪽으로 포인터 좌표를 변환하는데 사용
  const containerRef = useRef<HTMLDivElement | null>(null);
  const containerBoundsRef = useRef<DOMRectReadOnly | null>(null);

  // 히트박스 캐싱 ref
  const hitboxesRef = useRef<TimeCellHitbox[]>([]);

  // 실제 드래그 시작점 ref
  // e.clientX/Y는 뷰포트 기준이므로, 컨테이너 내부 좌표로 변환하여 저장
  const startPointRef = useRef<Point>({ x: 0, y: 0 });

  // add인지 remove인지 확인하는 ref
  const editModeRef = useRef<SelectionMode>('add');

  usePreventScroll(containerRef);

  // rAF 배치 + 취소 초기화
  const { schedule: scheduleFlush, cancel: cancelRaf } = createRafBatch(() => {
    syncCellClasses(containerRef.current, workingSetRef.current);
  });

  // 레이아웃 캐시 갱신(경계+히트박스)를 ref에 저장
  const updateLayoutCache = useCallback(() => {
    const container = containerRef.current;
    const bounds = getContainerBounds(container);
    containerBoundsRef.current = bounds;
    if (container && bounds) {
      hitboxesRef.current = populateHitboxes(container, bounds);
    }
  }, []);

  const onDragStart = useCallback(
    (event: React.PointerEvent) => {
      // 0) 레이아웃 캐시 갱신
      updateLayoutCache();

      // 1) 경계/셀 키 확보
      const bounds = containerBoundsRef.current;
      const key = getCellKeyFromEvent(event);
      if (!bounds || !key) return;

      // 2) 드래그 상태 진입
      setDraggingClass(containerRef.current, true);
      event.currentTarget.setPointerCapture(event.pointerId);

      // 3) 시작점 기록
      const localPoint = toLocalPoint(event, bounds);
      startPointRef.current = { x: localPoint.x, y: localPoint.y };

      // 4) 모드 결정 & 현재 시작 셀 즉시 반영
      const mode = decideEditMode(workingSetRef.current, key);
      editModeRef.current = mode;

      if (mode === 'add') workingSetRef.current.add(key);
      else workingSetRef.current.delete(key);

      // 5) UI 반영 예약
      scheduleFlush();
    },
    [updateLayoutCache, scheduleFlush]
  );

  const onDragMove = useCallback(
    (event: React.PointerEvent) => {
      // 1) 경계/히트박스 확보
      const bounds = containerBoundsRef.current;
      if (!bounds) return;

      // 2) 현재 타임테이블 내부로 x,y 포인트로 변환
      const currentPoint = toLocalPoint(event, bounds);

      // 3) 2에서 만든 포인트로 rect 영역 생성
      const region = makeRectFromPoints(startPointRef.current, currentPoint);

      // 4) 히트박스 영역과 겹치는 셀들에 대해 드래그
      sweepSelection(workingSetRef.current, hitboxesRef.current, region, editModeRef.current);

      // 5) UI 반영 예약
      scheduleFlush();
    },
    [scheduleFlush]
  );

  // 상태를 글로벌 스토어에 커밋

  const commitSelection = useCallback(() => {
    userAvailabilityStore.setState((prev) => ({
      ...prev,
      selectedTimes: new Set(workingSetRef.current),
    }));
  }, []);

  // 드래그 상태 클린업
  const cleanUp = useCallback(() => {
    setDraggingClass(containerRef.current, false);
    hitboxesRef.current = [];
    containerBoundsRef.current = null;
  }, []);

  const onDragEnd = useCallback(
    (event: React.PointerEvent) => {
      try {
        //1) 포인터 캡쳐 해제
        event.currentTarget.releasePointerCapture(event.pointerId);
        //2) rAF 취소 & 강제 동기화
        cancelRaf();
        syncCellClasses(containerRef.current, workingSetRef.current);
        //3) 상태 store에 커밋
        commitSelection();
      } finally {
        //4) 모든 드래그 상태 클린업
        cleanUp();
      }
    },
    [cancelRaf, commitSelection, cleanUp]
  );

  // 외부에서 selectedTimes가 바뀌면 workingSetRef를 동기화하고 UI 갱신 예약
  // 외부 변경은 처음에 fetch 할때 이뤄짐.
  useEffect(() => {
    workingSetRef.current = new Set(selectedTimes);
    scheduleFlush();
  }, [selectedTimes, scheduleFlush]);

  // 언마운트시 드래그 상태 클린업
  useEffect(
    () => () => {
      cancelRaf();
      cleanUp();
    },
    [cancelRaf, cleanUp]
  );

  const pointerHandlers = useMemo(
    () => ({
      onPointerDown: onDragStart,
      onPointerMove: onDragMove,
      onPointerUp: onDragEnd,
      onPointerCancel: onDragEnd,
      onLostPointerCapture: onDragEnd,
    }),
    [onDragStart, onDragMove, onDragEnd]
  );

  return { containerRef, pointerHandlers };
};

export default useLocalTimeSelection;
