import createStore from '@/shared/store/createStore';
import { useSyncExternalStore } from 'react';

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

  const startDragging = () => store.setState((prev) => ({ ...prev, isDragging: true }));
  const stopDragging = () => store.setState((prev) => ({ ...prev, isDragging: false }));
  const togglePreview = () =>
    store.setState((prev) => ({ ...prev, isPreviewOn: !prev.isPreviewOn }));

  return {
    ...store,
    startDragging,
    stopDragging,
    togglePreview,
  };
};

export const glassPreviewStore = createGlassPreviewStore();

export const useGlassPreview = () => {
  return useSyncExternalStore(glassPreviewStore.subscribe, glassPreviewStore.getSnapshot);
};
