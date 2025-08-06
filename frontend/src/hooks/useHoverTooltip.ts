import { useCallback, useState, useEffect, useRef } from 'react';

// 연속 입력(pointermove)이 초당 수백 번 들어와도, 매 이벤트마다 setState로 렌더를 유발하지 않도록,
// 최신 좌표는 ref에만 저장하고(requestAnimationFrame 직전까지 누적),
// rAF 콜백에서 프레임당 1회만 setState로 반영하는 패턴입니다.

// 1. ref에 최신 좌표를 저장합니다.
// 2. requestAnimationFrame을 사용하여 setPosition를 예약합니다.
// 이때 이 좌표는 ref에 저장된 최신 좌표를 사용하여, 리엑트 렌더를 유발하지 않습니다.
// 3. 이 이벤트를 전역 이벤트 리스너에 걸어줍니다.
// 4. 리턴으로 사용 끝난 훅은 정리해줍니다.

export function useHoverTooltip() {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const latestPosRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    let rafId: number | null = null;

    const handlePointerMove = (e: PointerEvent) => {
      // rAF 예약 전에 최신 위치를 ref에 저장하는 버퍼(Q&A 참고)
      // 1.
      latestPosRef.current = { x: e.clientX, y: e.clientY };

      // rAF로 다음 리페인트 직전에 위치 갱신을 1회만 예약한다.
      // 이미 예약이 있으면(mousemove 연속) 추가 예약을 막아 프레임당 setState 1회로 코얼레싱
      // 코얼레싱 : “여러 번 들어온 업데이트를 묶어서 더 적은 횟수로 처리”.
      // 콜백이 실행되면 예약이 끝났으므로 rafId를 null로 되돌려 다음 입력에서 재예약 가능하게 한다.
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

  const onEnter = useCallback((e?: React.MouseEvent) => {
    if (!e) return;
    const p = { x: e.clientX, y: e.clientY };
    latestPosRef.current = p;
    // 초기값 딱 한번을 한정으로 이렇게 해주지 않으면...
    // 깜빡임 있어용.
    setPosition(p);
    setOpen(true);
  }, []);

  const onLeave = useCallback(() => {
    setOpen(false);
  }, []);

  return { open, position, onEnter, onLeave };
}

// Q&A

//1. 왜 rAF를 사용하고, 여기서는 어떻게 동작하나요?

// 성능 문제: 마우스를 움직일 때마다 mousemove 이벤트가 초당 수십~수백 번 발생합니다
// 만약 없이 썼다면, 매번 마우스 포인터 움직일때 마다 state 갱신이 되기 때문에
// 많이 렌더링이 발생해요. 마우스 폴링 레이트에도 영향이 있을수도?
// requestAnimationFrame (rAF)를 사용하면,
// 브라우저의 화면 갱신 주기(보통 60fps)에 맞춰서만 위치 업데이트를 하는데요.
// 이로 인해, 마우스가 움직이는 동안에도 렌더링이 최소화되어 성능이 향상됩니다.
// 안쓰면 깜빡이는 것이 늡니다.

// 2. 왜 latestPosRef를 사용하나요?

// 버퍼의 쓰임새에 대해서 조금 고민이 많을것 같은데요.
// setState를 하는 것만 자체로만 해도 렌더링이 발생하기 때문에,
// rAF의 큐를 쓰는 원래 목적과 달라지게 됩니다.
// 따라서 latestPosRef를 사용하여
// 현재 마우스 위치를 렌더 유발 없이 저장하고, rAF가 실행될 때만 state를 업데이트합니다.
