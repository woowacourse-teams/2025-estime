import { useEffect } from 'react';
import type { HandleErrorReturn } from '../Error/useCreateError';

interface Handlers {
  onVoteChange: () => Promise<void>;
}

export default function useSSE(session: string, handleError: HandleErrorReturn, handler: Handlers) {
  useEffect(() => {
    if (!session) return;

    const es = new EventSource(`${process.env.API_BASE_URL}api/v1/sse/rooms/${session}/stream`);

    const onConnected = (ev: MessageEvent<string>) => {
      try {
        const data = JSON.parse(ev.data);
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

    const cleanup = () => {
      try {
        es.close();
      } catch {
        // es가 닫혔는데 다시 닫으려 할때
        // 오류 발생
      }
    };

    es.addEventListener('connected', onConnected);
    es.addEventListener('vote-changed', onVoteChange);

    const onPageHide = () => cleanup();
    window.addEventListener('pagehide', onPageHide);

    es.onerror = (e) => {
      console.error('SSE 오류:', e);
      handleError(e, 'SSE 오류');
    };

    return () => {
      es.removeEventListener('connected', onConnected);
      es.removeEventListener('vote-changed', onVoteChange);
      window.removeEventListener('pagehide', onPageHide);
      cleanup();
    };
  }, [session]);
}
