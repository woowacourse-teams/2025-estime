export const DEFAULT_HOUR_OPTIONS = Array.from({ length: 25 }, (_, i) => {
  const hour = `${String(i).padStart(2, '0')} : 00`;
  return hour;
});
