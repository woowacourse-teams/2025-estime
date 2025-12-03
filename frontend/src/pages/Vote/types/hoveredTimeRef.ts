export interface HoveredTimeRef {
  current: string | null;
  update?: (hovered: string | null) => void;
}
