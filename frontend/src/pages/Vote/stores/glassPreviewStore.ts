import createStore from '@/shared/store/createStore';
import { useCallback, useSyncExternalStore } from 'react';

interface GlassPreviewState {
  isPreviewOn: boolean;
}

const initialGlassPreviewState: GlassPreviewState = {
  isPreviewOn: false,
};

const createGlassPreviewStore = () => {
  const store = createStore<GlassPreviewState>(initialGlassPreviewState);

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
