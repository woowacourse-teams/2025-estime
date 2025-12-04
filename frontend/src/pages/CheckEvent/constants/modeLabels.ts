import type { FlowMode } from '../hooks/useCheckEventHandlers';

export const MODE_LABELS: Record<FlowMode, string> = {
  register: '등록하기',
  save: '저장하기',
  edit: '수정하기',
} as const;

