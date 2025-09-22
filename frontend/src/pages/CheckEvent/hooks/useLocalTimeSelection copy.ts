// import { useRef, useCallback, useState, useEffect, useMemo } from 'react';
// import { useLockBodyScroll } from '../../../shared/hooks/common/useLockBodyScroll';
// import { useTimeSelectionContext } from '../contexts/CheckPageContext';

// interface UseLocalTimeSelectionOptions {
//   initialSelectedTimes: Set<string>;
// }

// type TimeCellHitbox = {
//   key: string; // data-time

//   left: number;
//   right: number;
//   top: number;
//   bottom: number;
// };

// const useLocalTimeSelection = ({ initialSelectedTimes }: UseLocalTimeSelectionOptions) => {
//   const { updateCurrentSelectedTimes } = useTimeSelectionContext();

//   // 렌더 트리거용(부모·자식 렌더는 이 값으로만 결정)
//   const [localSelectedTimes, setLocalSelectedTimes] = useState<Set<string>>(
//     () => new Set(initialSelectedTimes)
//   );

//   // 임계영역에 접근하기 위한 ref
//   const currentWorkingSetRef = useRef<Set<string>>(new Set(initialSelectedTimes));

//   const containerRef = useRef<HTMLDivElement | null>(null);
//   const [isTouch, setIsTouch] = useState(false);

//   const dragStartX = useRef(0);
//   const dragStartY = useRef(0);
//   const selectionModeRef = useRef<'add' | 'remove'>('add');
//   const isDraggingRef = useRef(false);

//   //스냅샷
//   const containerBoundingRectRef = useRef<DOMRectReadOnly | null>(null);
//   const dragHitboxesRef = useRef<TimeCellHitbox[]>([]);

//   const overlayRef = useRef<HTMLDivElement | null>(null);
//   const overlayStateRef = useRef({ x: 0, y: 0, w: 0, h: 0, visible: false });
//   const overlayRafRef = useRef<number | null>(null);

//   const paintOverlay = () => {
//     const el = overlayRef.current;
//     if (!el) return;

//     const { x, y, w, h, visible } = overlayStateRef.current;
//     if (!visible) {
//       el.style.opacity = '0';
//       return;
//     }

//     el.style.opacity = '1';
//     el.style.width = `${w}px`;
//     el.style.height = `${h}px`;
//     el.style.transform = `translate(${x}px, ${y}px)`;
//   };
//   const scheduleOverlayPaint = useCallback(() => {
//     if (overlayRafRef.current != null) return;
//     overlayRafRef.current = requestAnimationFrame(() => {
//       overlayRafRef.current = null;
//       paintOverlay();
//     });
//   }, []);
//   const updateOverlayRect = useCallback(
//     (left: number, top: number, right: number, bottom: number) => {
//       overlayStateRef.current = {
//         x: left,
//         y: top,
//         w: Math.max(0, right - left),
//         h: Math.max(0, bottom - top),
//         visible: true,
//       };
//       scheduleOverlayPaint();
//     },
//     [scheduleOverlayPaint]
//   );
//   // 배치(rAF)
//   const renderAnimationFrameId = useRef<number | null>(null);

//   const triggerRenderUpdate = useCallback(() => {
//     if (renderAnimationFrameId.current != null) return;
//     renderAnimationFrameId.current = requestAnimationFrame(() => {
//       renderAnimationFrameId.current = null;
//       setLocalSelectedTimes(new Set(currentWorkingSetRef.current));
//     });
//   }, []);

//   useLockBodyScroll(isTouch);

//   useEffect(() => {
//     const nextSelectedTimes = new Set(initialSelectedTimes);
//     currentWorkingSetRef.current = new Set(nextSelectedTimes);
//     setLocalSelectedTimes(nextSelectedTimes);
//     updateCurrentSelectedTimes(nextSelectedTimes);
//   }, [initialSelectedTimes, updateCurrentSelectedTimes]);

//   const cacheDragHitboxes = () => {
//     const container = containerRef.current;
//     if (!container) return;
//     const containerRect = container.getBoundingClientRect();
//     containerBoundingRectRef.current = containerRect;

//     const hitboxes: TimeCellHitbox[] = [];
//     // 모든 selectable 요소를 순회하며
//     container.querySelectorAll<HTMLElement>('.selectable').forEach((selectableElement) => {
//       const dateTime = selectableElement.getAttribute('data-time');
//       if (!dateTime) return;
//       const elementRect = selectableElement.getBoundingClientRect();
//       hitboxes.push({
//         key: dateTime,
//         left: elementRect.left - containerRect.left,
//         right: elementRect.right - containerRect.left,
//         top: elementRect.top - containerRect.top,
//         bottom: elementRect.bottom - containerRect.top,
//       });
//     });
//     dragHitboxesRef.current = hitboxes;
//   };

//   const handleDragStart = useCallback(
//     (event: React.PointerEvent) => {
//       setIsTouch(event.pointerType === 'touch');

//       cacheDragHitboxes();

//       const bounds = containerBoundingRectRef.current;
//       if (!bounds) return;

//       // 클릭한 요소에서 가장 가까운 셀 찾기
//       const targetCell = (event.target as HTMLElement).closest('.selectable') as HTMLElement | null;
//       const cellKey = targetCell?.dataset.time;
//       if (!cellKey) return;
//       isDraggingRef.current = true;
//       // 컨테이너 기준 시작 좌표 보정
//       const startX = event.clientX - bounds.left;
//       const startY = event.clientY - bounds.top;
//       dragStartX.current = startX;
//       dragStartY.current = startY;

//       // 드래그 의도(add/remove) 결정
//       selectionModeRef.current = currentWorkingSetRef.current.has(cellKey) ? 'remove' : 'add';

//       // 첫 셀 즉시 반영
//       if (selectionModeRef.current === 'add') {
//         currentWorkingSetRef.current.add(cellKey);
//       } else {
//         currentWorkingSetRef.current.delete(cellKey);
//       }

//       triggerRenderUpdate();
//       overlayStateRef.current.visible = true;
//       updateOverlayRect(
//         dragStartX.current,
//         dragStartY.current,
//         dragStartX.current,
//         dragStartY.current
//       );
//     },
//     [triggerRenderUpdate, updateOverlayRect]
//   );

//   const handleDragMove = useCallback(
//     (event: React.PointerEvent) => {
//       if (!isDraggingRef.current) return;
//       const bounds = containerBoundingRectRef.current;
//       if (!bounds) return;

//       // 포인터의 컨테이너 기준 좌표
//       const pointerX = event.clientX - bounds.left;
//       const pointerY = event.clientY - bounds.top;

//       // 현재 드래그 선택 사각형
//       const selectionRect = {
//         left: Math.min(dragStartX.current, pointerX),
//         top: Math.min(dragStartY.current, pointerY),
//         right: Math.max(dragStartX.current, pointerX),
//         bottom: Math.max(dragStartY.current, pointerY),
//       };
//       updateOverlayRect(
//         selectionRect.left,
//         selectionRect.top,
//         selectionRect.right,
//         selectionRect.bottom
//       );

//       let didChange = false;

//       for (const cell of dragHitboxesRef.current) {
//         const overlaps =
//           cell.left < selectionRect.right &&
//           cell.right > selectionRect.left &&
//           cell.top < selectionRect.bottom &&
//           cell.bottom > selectionRect.top;

//         if (!overlaps) continue;

//         if (selectionModeRef.current === 'add') {
//           if (!currentWorkingSetRef.current.has(cell.key)) {
//             currentWorkingSetRef.current.add(cell.key);
//             didChange = true;
//           }
//         } else {
//           if (currentWorkingSetRef.current.has(cell.key)) {
//             currentWorkingSetRef.current.delete(cell.key);
//             didChange = true;
//           }
//         }
//       }

//       if (didChange) triggerRenderUpdate();
//     },
//     [triggerRenderUpdate, updateOverlayRect]
//   );

//   const resetDragState = useCallback(() => {
//     dragHitboxesRef.current = [];
//     containerBoundingRectRef.current = null;
//     setIsTouch(false);
//   }, []);

//   const handleDragEnd = useCallback(() => {
//     if (!isDraggingRef.current) return;
//     isDraggingRef.current = false;
//     resetDragState();
//     const finalSelectedTimes = new Set(currentWorkingSetRef.current);

//     triggerRenderUpdate();
//     updateCurrentSelectedTimes(finalSelectedTimes);
//     overlayStateRef.current.visible = false;
//     scheduleOverlayPaint();
//   }, [updateCurrentSelectedTimes, resetDragState, triggerRenderUpdate, scheduleOverlayPaint]);

//   const handleDragLeave = useCallback(() => {
//     isDraggingRef.current = false;
//     resetDragState();
//     overlayStateRef.current.visible = false;
//     scheduleOverlayPaint();
//   }, [resetDragState, scheduleOverlayPaint]);

//   const pointerHandlers = useMemo(
//     () => ({
//       onPointerDown: handleDragStart,
//       onPointerMove: handleDragMove,
//       onPointerUp: handleDragEnd,
//       onPointerLeave: handleDragLeave,
//     }),
//     [handleDragEnd, handleDragLeave, handleDragMove, handleDragStart]
//   );
//   const overlayProps = useMemo(
//     () => ({
//       ref: overlayRef,
//       style: {
//         position: 'absolute' as const,
//         top: 0,
//         left: 0,
//         opacity: 0,

//         background: '#8052E188',
//         transform: 'translate(0,0)',
//         pointerEvents: 'none' as const,
//         willChange: 'transform',
//       },
//     }),
//     []
//   );
//   return {
//     containerRef,
//     localSelectedTimes,
//     pointerHandlers,
//     overlayProps,
//   };
// };

// export default useLocalTimeSelection;
