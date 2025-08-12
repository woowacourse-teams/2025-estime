import type { Field } from '@/types/field';
import { useCallback, useRef, useState } from 'react';

type DragMode = 'add' | 'remove';

interface DragRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

const DEFAULT_DRAG_THRESHOLD = 2; // 드래그 시작 기준 거리(px) - 터치 환경을 고려하여 증가 (클릭하는 것과 의도적인 드래그를 구분하는 임계값)

const useTimeSelection = (selectedTimes: Field<Set<string>>) => {
  const { value: selectedTimeSlots, set: setSelectedTimeSlots } = selectedTimes;
  // [1] 준비: 컨테이너 ref, 드래그 시작점, 드래그 모드, 드래그 플래그, 포인터ID
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [dragMode, setDragMode] = useState<DragMode>('add');

  const isDragging = useRef(false);

  // 멀티터치 방지용 - 여러 손가락으로 터치하면 슬퍼지는 경우 방지.
  // 하나의 포인터만 훅에서는 허용합니다.
  const activePointerId = useRef<number | null>(null);

  // [2] 유틸: 두 사각형 겹침 판정 (컨테이너 기준 좌표계)
  // AABB(Axis-Aligned Bounding Box) 충돌 검사
  function isOverlapping(a: DragRect, b: DragRect): boolean {
    // 겹치는 조건을 직접 체크해도 되는데,
    // 겹치지 않는 경우부터 체크하는게 더 효율적이고 (얼리리턴)
    // 이해하기 쉬움
    // a가 b 완전히 왼쪽에 있거나, 완전히 오른쪽에 있거나, 완전히 위에 있거나, 완전히 아래에 있으면 안겹침
    return !(
      a.x + a.width < b.x || // a가 b의 왼쪽에 완전히 위치
      b.x + b.width < a.x || // b가 a의 왼쪽에 완전히 위치
      a.y + a.height < b.y || // a가 b의 위쪽에 완전히 위치
      b.y + b.height < a.y // b가 a의 위쪽에 완전히 위치
    );
    // 위 조건들 중 하나라도 참이면 겹치지 않음 -> !로 뒤집어서 겹침 여부 반환
  }

  // [3] 유틸: 포인터 위치에서 가장 가까운 data-item 요소의 키 찾기
  // 클릭 위치에서 가장 가까운 아이템을 찾기 위함인데,
  // 클릭만 한다면 드래그 이벤트가 발생되지가 않기 때문에,
  // 이 유틸을 사용해서 클릭 위치에서 가장 가까운 아이템을 찾아요.
  // 클릭한 곳의 요소의 add/remove상태를 보고 추가/삭제 모드를 결정하는데 사용되기도 합니다.
  const getItemKeyAt = useCallback((clientX: number, clientY: number): string | null => {
    // elementFromPoint로 해당 좌표에 있는 최상위 요소를 가져옴
    const el = document.elementFromPoint(clientX, clientY);
    if (!(el instanceof HTMLElement)) {
      return null;
    }
    // 자식 노드를 찍었을 수도 있으므로 closest로 상위 탐색
    const hit = el.closest('[data-item]');
    if (!(hit instanceof HTMLElement)) {
      return null;
    }
    // 타입 체크 - dataset.item이 진짜 문자열인지 확인
    if (hit.dataset && typeof hit.dataset.item === 'string') {
      return hit.dataset.item;
    }
    return null;
  }, []);

  // [4] 핵심: 드래그 사각형과 겹치는 모든 아이템을 모드에 맞게 추가/제거
  const updateSelection = useCallback(
    (dragRect: DragRect) => {
      if (!containerRef.current) {
        return;
      }
      // 4.0: 이 컨테이너를 기준으로....(타임테이블 컨테이너)
      const containerRect = containerRef.current.getBoundingClientRect();
      const next = new Set(selectedTimeSlots);

      // 4.1: 컨테이너 내의 모든 data-item 요소를 찾는데요,
      const items = containerRef.current.querySelectorAll('[data-item]');

      items.forEach((el) => {
        if (!(el instanceof HTMLElement)) {
          return;
        }
        const key = el.dataset ? el.dataset.item : undefined;
        if (!key) {
          return;
        }

        //4.2 요소의 위치와 크기를 그대로 쓰면 안되고,
        // 그 위치가 요소가 속한 컨테이너 기준으로 변환을 해야 해요.
        // 안그럼 위치가 뷰포트 기준의 절대좌표로 고정됩니다.
        // getBoundingClientRect()는 뷰포트 기준 절대좌표를 리턴하는데,
        // dragRect는 컨테이너 기준 상대좌표라서 좌표계를 맞춰줘야 함
        const r = el.getBoundingClientRect();
        const rect: DragRect = {
          x: r.left - containerRect.left, // 절대좌표 -> 상대좌표 변환
          y: r.top - containerRect.top,
          width: r.width,
          height: r.height,
        };

        // 4.3: 드래그 사각형과 겹치는지 확인하고,
        const hit = isOverlapping(dragRect, rect);

        // 4.4: 모드에 따라 추가/제거
        if (hit) {
          if (dragMode === 'add') {
            next.add(key);
          } else {
            next.delete(key);
          }
        }
      });

      setSelectedTimeSlots(next);
    },
    [selectedTimeSlots, setSelectedTimeSlots, dragMode]
  );

  // [5] 시작: 포인터 다운에서 모드 결정 + 시작점 기록 + 포인터 캡처(모바일 대응)
  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      // 마우스일 때만 좌클릭 제한, 터치/펜은 통과 e.button = 0 은 좌클릭
      if (e.pointerType === 'mouse' && e.button !== 0) {
        return; // 우클릭이나 휠클릭을 해줄 필요는 없겠죠?
      }

      if (!containerRef.current) {
        return;
      }

      // 스크롤/텍스트 선택 방지 - 이거 안하면 드래그할 때 스크롤이 될지도.
      e.preventDefault();

      if (e.pointerType === 'touch') {
        // 터치 시 스크롤 방지를 위한 추가 처리
        e.stopPropagation();
      }

      // 포인터 캡처: 컨테이너 밖으로 나가도 move/up 이벤트를 계속 받기 위함 (모바일/펜 포함)
      // 이걸 안하면 모바일에서 드래그가 이상해짐 - 손가락이 영역 밖으로 나가면 이벤트 끊김
      containerRef.current.setPointerCapture(e.pointerId);
      activePointerId.current = e.pointerId;

      const key = getItemKeyAt(e.clientX, e.clientY);
      if (!key) {
        return;
      }

      if (selectedTimeSlots.has(key)) {
        setDragMode('remove');
      } else {
        setDragMode('add');
      }

      // 시작점을 컨테이너 기준 좌표로 저장
      const rect = containerRef.current.getBoundingClientRect();
      const startX = e.clientX - rect.left; // 뷰포트 좌표 -> 컨테이너 좌표
      const startY = e.clientY - rect.top;
      setDragStart({ x: startX, y: startY });
    },
    [selectedTimeSlots, getItemKeyAt]
  );

  // [6] 이동: move에서만 드래그 판단/선택 갱신
  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!dragStart) {
        return; // 시작 안했으면 무시
      }
      if (!containerRef.current) {
        return;
      }
      // 활성 포인터만 처리 (멀티터치 등 방지)
      // 여러 손가락으로 터치하면 여러 포인터 이벤트가 오는데 그거 방지
      if (activePointerId.current !== null && e.pointerId !== activePointerId.current) {
        return;
      }

      const rect = containerRef.current.getBoundingClientRect();
      const curX = e.clientX - rect.left;
      const curY = e.clientY - rect.top;

      // 맨하탄 거리로 이동거리 계산
      // 드래그 시작 판정 - 임계값 넘으면 진짜 드래그로 인정
      // 사실 이부분은 코어한 부분은 아닌데요.
      // 근데 저 맨하탄 뭐시기 까지 들여오면서 움직였던 거리를 쟀던 이유는
      // 실수로 클릭하는 것과 의도적인 드래그를 구분하기 위함이에요.
      // Threshold(임계값)보다 작으면 그냥 클릭으로 간주하고,
      // Threshold 이상이면 드래그로 간주해서 사각형을 그리기 시작합니다.
      const dx = Math.abs(curX - dragStart.x);
      const dy = Math.abs(curY - dragStart.y);
      const moved = dx + dy;

      // onPointerMove에서 이동거리가 임계값을 넘으면
      // 드래그 상태로 전환합니다.
      if (moved >= DEFAULT_DRAG_THRESHOLD) {
        isDragging.current = true;
      }

      if (isDragging.current) {
        //TODO: rAF적용 - requestAnimationFrame으로 성능 최적화 고려
        // 지금은 모든 move이벤트마다 계산해서 성능 이슈 있을 수 있음

        // 터치 이벤트에서 스크롤 방지
        if (e.pointerType === 'touch') {
          e.preventDefault();
        }

        // 드래그 사각형 만들기 - 시작점과 현재점으로 사각형 생성

        // Math.min/max 쓰는 이유: 어느 방향으로 드래그해도 올바른 사각형 만들어짐
        // http://joshuawootonn.com/react-drag-to-select#using-a-vector

        const dragRect: DragRect = {
          x: Math.min(dragStart.x, curX), // 왼쪽 끝
          y: Math.min(dragStart.y, curY), // 위쪽 끝
          width: Math.abs(curX - dragStart.x), // 가로 크기
          height: Math.abs(curY - dragStart.y), // 세로 크기
        };
        updateSelection(dragRect); // 이동 중에만 상태 갱신
      }
    },
    [dragStart, updateSelection]
  );

  // [7] 종료: 드래그가 아니면 단일 클릭 토글, 드래그였으면 이미 반영됨
  const onPointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!dragStart) {
        return;
      }

      // 포인터 캡처 해제 - 정리작업
      if (containerRef.current && activePointerId.current !== null) {
        try {
          containerRef.current.releasePointerCapture(activePointerId.current);
        } catch {
          // 근데 containerRef.current.releasePointerCapture가 실패하는 경우도 있어서
          // 핸들링을 해준다고 합니다.
          // 실패 케이스: 이미 해제됨, 포인터 없음, 브라우저 호환성 문제 등
          // 없으면 uncaught 에러 발생해서..
          // 웹사이트가 흰색이 될지도.
        }
      }
      activePointerId.current = null;

      // 7.1:  드래그가 아니면 단일 클릭으로 치부를 합니다.
      // 이 부분이 없으면 그냥 클릭했을때,
      // 드래그 이벤트가 발생하지 않아서 아이템이 선택되지 않아요.
      // 클릭했을 때 이벤트를 넣어주기 위해서 만든거에요.

      if (!isDragging.current) {
        const key = getItemKeyAt(e.clientX, e.clientY);
        if (key) {
          const next = new Set(selectedTimeSlots);
          if (selectedTimeSlots.has(key)) {
            next.delete(key);
          } else {
            next.add(key);
          }
          setSelectedTimeSlots(next);
        }
      }

      setDragStart(null);
      isDragging.current = false;
    },
    [dragStart, selectedTimeSlots, setSelectedTimeSlots, getItemKeyAt]
  );

  // [8] 취소/이탈: 강제 초기화 (브라우저 제스처/멀티터치 등 예외 상황)
  // 언제 발생하나: 뒤로가기 제스처, 새로고침, 멀티터치, 시스템 알림, 전화옴 등등
  const onPointerCancel = useCallback(() => {
    if (containerRef.current && activePointerId.current !== null) {
      try {
        containerRef.current.releasePointerCapture(activePointerId.current);
      } catch {
        // 에러를 받기만 하고
        // noop(no-operation) 아무것도 하지 않아유.
        // uncaught 에러를 방지
      }
    }
    activePointerId.current = null;
    setDragStart(null);
    isDragging.current = false;
  }, []);

  // [9] 외부로 노출: ref, 포인터 핸들러, 리셋 함수
  return {
    containerRef,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,

    // 외부에서 수동으로 상태 초기화하고 싶을 때 사용
    // 또한, 완전 초기화 하고 싶을때 어떤 플래그를 초기화 해야 하는지 알수 있겠지용.
    reset: () => {
      if (containerRef.current && activePointerId.current !== null) {
        try {
          containerRef.current.releasePointerCapture(activePointerId.current);
        } catch {
          // 에러를 받기만 하고
          // noop(no-operation) 아무것도 하지 않아유.
          // uncaught 에러를 방지
        }
      }
      activePointerId.current = null;
      setDragStart(null);
      isDragging.current = false;
    },
  };
};

export default useTimeSelection;
