import { useEffect, useRef } from 'react';
import type { HandleErrorReturn } from '../../../shared/hooks/common/useCreateError';

interface Handlers {
  onVoteChange: () => Promise<void>;
}

const MAX_RETRY_COUNT = 10;
const RETRY_INTERVAL = 1000; // 1초
const REFRESH_INTERVAL = 5 * 60 * 1000; // 5분

const useSSE = (session: string, handleError: HandleErrorReturn, handler: Handlers) => {
  const retryCountRef = useRef(0);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const connectionFailedRef = useRef(false);
  const isActiveRef = useRef(true);

  useEffect(() => {
    if (!session) return;

    const clearRetryTimeout = () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }
    };

    const clearRefreshInterval = () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
    };

    const closeEventSource = () => {
      if (eventSourceRef.current) {
        try {
          eventSourceRef.current.close();
        } catch {
          // 이미 닫혀 있을 수 있음
        }
        eventSourceRef.current = null;
      }
    };

    const scheduleRefresh = () => {
      clearRefreshInterval();
      refreshIntervalRef.current = setInterval(() => {
        if (!isActiveRef.current) return;
        connectSSE();
      }, REFRESH_INTERVAL);
    };

    const connectSSE = () => {
      if (!isActiveRef.current) return;

      clearRetryTimeout();
      closeEventSource();

      const url = `${process.env.API_BASE_URL}api/v1/sse/rooms/${session}/stream`;
      const es = new EventSource(url);
      eventSourceRef.current = es;

      const onConnected = (ev: MessageEvent<string>) => {
        try {
          const data = JSON.parse(ev.data);
          retryCountRef.current = 0;
          connectionFailedRef.current = false;
          console.log('SSE 연결됨:', data);
        } catch (error) {
          handleError(error, 'SSE 연결 이벤트 파싱 오류');
        }
      };

      const onVoteChange = async (ev: MessageEvent<string>) => {
        try {
          JSON.parse(ev.data);
          await handler.onVoteChange();
        } catch (error) {
          handleError(error, 'SSE 핸들러 오류');
        }
      };

      es.addEventListener('connected', onConnected);
      es.addEventListener('vote-changed', onVoteChange);

      es.onerror = () => {
        if (!isActiveRef.current) return; // 비활성 상태에서는 재시도 안 함
        if (retryCountRef.current < MAX_RETRY_COUNT) {
          retryCountRef.current += 1;
          clearRetryTimeout();
          retryTimeoutRef.current = setTimeout(() => {
            connectSSE();
          }, RETRY_INTERVAL);
        } else if (!connectionFailedRef.current) {
          connectionFailedRef.current = true;
          handleError(new Error('SSE 연결 실패'), 'SSE 연결을 복구할 수 없습니다');
        }
      };

      scheduleRefresh();

      return es;
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
