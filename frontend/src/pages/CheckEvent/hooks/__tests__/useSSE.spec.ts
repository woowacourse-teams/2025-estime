import { act, renderHook } from '@testing-library/react';
import useSSE from '../useSSE';

jest.mock('@/shared/hooks/common/useCreateError', () => ({
  __esModule: true,
  default: () => jest.fn(),
}));

class FakeEventSource {
  static instances: FakeEventSource[] = [];
  onerror: ((ev: Event) => void) | null = null;
  private listeners: Record<string, Array<(ev: MessageEvent<string>) => void>> = {};

  constructor(public url: string) {
    FakeEventSource.instances.push(this);
  }

  addEventListener(type: string, listener: (ev: MessageEvent<string>) => void) {
    (this.listeners[type] ??= []).push(listener);
  }

  close() {}

  emit(type: string) {
    this.listeners[type]?.forEach((listener) => listener(new MessageEvent(type, { data: '{}' })));
  }
}

const emit = (type: string) =>
  act(async () => {
    FakeEventSource.instances[FakeEventSource.instances.length - 1].emit(type);
  });

describe('useSSE는', () => {
  beforeEach(() => {
    FakeEventSource.instances = [];
    global.EventSource = FakeEventSource as unknown as typeof EventSource;
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('연결될 때마다 통계를 다시 조회한다', async () => {
    const onVoteChange = jest.fn().mockResolvedValue(undefined);
    const { unmount } = renderHook(() => useSSE('session', onVoteChange));

    await emit('connected');
    await emit('connected');

    expect(onVoteChange).toHaveBeenCalledTimes(2);
    unmount();
  });

  it('투표 변경 신호를 받으면 통계를 다시 조회한다', async () => {
    const onVoteChange = jest.fn().mockResolvedValue(undefined);
    const { unmount } = renderHook(() => useSSE('session', onVoteChange));

    await emit('votes-updated');

    expect(onVoteChange).toHaveBeenCalledTimes(1);
    unmount();
  });
});
