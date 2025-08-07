import { useCallback, useState, useEffect, useRef } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';

// 연속 입력(pointermove)이 초당 수백 번 들어와도, 매 이벤트마다 setState로 렌더를 유발하지 않도록,
// 최신 좌표는 ref에만 저장하고(requestAnimationFrame 직전까지 누적),
// rAF 콜백에서 프레임당 1회만 setState로 반영하는 패턴입니다.

// 1. ref에 최신 좌표를 저장합니다.
// 2. requestAnimationFrame을 사용하여 setPosition를 예약합니다.
// 이때 이 좌표는 ref에 저장된 최신 좌표를 사용하여, 리엑트 렌더를 유발하지 않습니다.
// 3. 이 이벤트를 전역 이벤트 리스너에 걸어줍니다.
// 4. 리턴으로 사용 끝난 훅은 정리해줍니다.

export function useHoverTooltip() {
  // open이 없으면
  // 이 이벤트의 발생을 마우수 onLeave할때, 막을수 없어요.
  // 이 훅을 사용하는 컴포넌트에서 open을 관리해줘야 합니다.

  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const latestPosRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    let rafId: number | null = null;

    const handlePointerMove = (e: PointerEvent) => {
      // 1 .ref에 최신 좌표를 저장합니다.
      latestPosRef.current = { x: e.clientX, y: e.clientY };

      if (rafId) return;
      // 2.
      rafId = requestAnimationFrame(() => {
        setPosition(latestPosRef.current);
        // null로 초기화하여, 다음 이벤트에서 이벤트를 다시 예약할 수 있도록 함
        // 간단히 말하자면, 한 프레임당 한 번만 위치를 업데이트
        // 한 id = 한 개의 예약 = 한개의 프레임.
        rafId = null;
      });
    };

    if (open) {
      // 3.
      document.addEventListener('pointermove', handlePointerMove, { passive: true });
    }

    return () => {
      // 4.
      document.removeEventListener('pointermove', handlePointerMove);
      // 만약 컴포넌트가 언마운트되거나 open이 false로 바뀌면
      // 현재 예약된 rAF가 있다면 취소한다.
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      rafId = null;
    };
  }, [open]);

  // 이렇게 해주지 않으면...
  // 초기 위치가 0,0으로 잡혀서
  // 0,0 위치로 툴팁이 열립니다.
  // 이를 현재위치로 잡아주는 초기화가 필요해요.
  const initializePosition = useCallback((e: ReactPointerEvent) => {
    const p = { x: e.clientX, y: e.clientY };
    latestPosRef.current = p;
    setPosition(p);
  }, []);

  const onEnter = useCallback(
    (e: ReactPointerEvent) => {
      initializePosition(e);
      setOpen(true);
    },
    [initializePosition]
  );

  const onLeave = useCallback(() => {
    setOpen(false);
  }, []);

  return { open, position, onEnter, onLeave };
}
