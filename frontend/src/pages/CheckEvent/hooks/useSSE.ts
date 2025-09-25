import { useEffect, useRef } from 'react';
import type { HandleErrorReturn } from '../../../shared/hooks/common/useCreateError';

interface Handlers {
  onVoteChange: () => Promise<void>;
}

// SSE 재연결 관련 상수
const MAX_RETRY_COUNT = 10;
const RETRY_INTERVAL = 1000; // 1초

const useSSE = (session: string, handleError: HandleErrorReturn, handler: Handlers) => {
  const retryCountRef = useRef(0);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const connectionFailed = useRef(false);

  useEffect(() => {
    if (!session) return;

    const connectSSE = () => {
      // 기존 연결이 있으면 먼저 끊기
      if (eventSourceRef.current) {
        try {
          eventSourceRef.current.close();
        } catch {
          // 연결이 이미 닫혔을 경우 오류 무시
        }
        eventSourceRef.current = null;
      }

      const eventSource = new EventSource(
        `${process.env.API_BASE_URL}api/v1/sse/rooms/${session}/stream`
      );
      eventSourceRef.current = eventSource;

      const onConnected = (ev: MessageEvent<string>) => {
        try {
          const data = JSON.parse(ev.data);
          // 연결 성공시 재시도 카운트 초기화
          retryCountRef.current = 0;
          connectionFailed.current = false;
          // 삭제하거나, 유의미한 데이터를 파싱할때까지는 유지
          console.log('SSE 연결됨:', data);
        } catch (error) {
          handleError(error, 'SSE 연결 오류');
        }
      };

      const onVoteChange = async (ev: MessageEvent<string>) => {
        try {
          const data = JSON.parse(ev.data);
          await handler.onVoteChange();
          console.log('투표 변경:', data);
        } catch (error) {
          handleError(error, 'SSE 연결 오류');
        }
      };

      eventSource.addEventListener('connected', onConnected);
      eventSource.addEventListener('vote-changed', onVoteChange);

      eventSource.onerror = (e) => {
        if (retryCountRef.current < MAX_RETRY_COUNT) {
          retryCountRef.current += 1;
          console.error('SSE 연결 오류:', e);
          console.log(`SSE 재연결 시도 ${retryCountRef.current}/${MAX_RETRY_COUNT}`);

          retryTimeoutRef.current = setTimeout(() => {
            connectSSE();
          }, RETRY_INTERVAL);
        } else if (!connectionFailed.current) {
          connectionFailed.current = true;
          console.error('SSE 최대 재시도 횟수 초과');
          handleError(new Error('SSE 연결 실패'), 'SSE 연결을 복구할 수 없습니다');
        }
      };

      return eventSource;
    };

    const cleanup = () => {
      // 재시도 타이머 정리
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }

      // 재연결 인터벌 정리
      if (reconnectIntervalRef.current) {
        clearInterval(reconnectIntervalRef.current);
        reconnectIntervalRef.current = null;
      }

      // EventSource 정리
      if (eventSourceRef.current) {
        try {
          eventSourceRef.current.close();
        } catch {
          // es가 닫혔는데 다시 닫으려 할때 오류 발생
        }
        eventSourceRef.current = null;
      }
    };

    // 첫 연결 시도
    connectSSE();

    // 5분마다 재연결 (기존 연결을 끊고 새로 연결)
    reconnectIntervalRef.current = setInterval(
      () => {
        console.log('SSE 정기 재연결 시도');
        connectSSE();
      },
      5 * 60 * 1000
    );

    return cleanup;
  }, [session]);
};

export default useSSE;
