import { DEFAULT_HOUR_OPTIONS } from '@/constants/defaultHourOptions';

export const filterHourOptions = (time: string) => {
  return DEFAULT_HOUR_OPTIONS.filter((option) => {
    const hourPart = Number(time.split(':')[0]);
    const defaultHourPart = Number(option.split(':')[0]);
    return hourPart < defaultHourPart;
  });
};
