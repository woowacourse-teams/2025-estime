import createStore from '@/shared/store/createStore';
import { useCallback, useSyncExternalStore } from 'react';

interface DragState {
  isDragging: boolean;
  isPreviewOn: boolean;
}

const initialDragState: DragState = {
  isDragging: false,
  isPreviewOn: true,
};

const createGlassPreviewStore = () => {
  const store = createStore<DragState>(initialDragState);

  const togglePreview = () =>
    store.setState((prev) => ({ ...prev, isPreviewOn: !prev.isPreviewOn }));

  return {
    ...store,
    togglePreview,
  };
};

export const glassPreviewStore = createGlassPreviewStore();

export const useGlassPreview = () => {
  const isOn = useSyncExternalStore(
    glassPreviewStore.subscribe,
    () => glassPreviewStore.getSnapshot().isPreviewOn
  );
  const toggle = useCallback(() => glassPreviewStore.togglePreview(), []);
  return { isOn, toggle };
};
