import { DEFAULT_HOUR_OPTIONS } from '@/constants/defaultHourOptions';
import { FormatManager } from '../common/FormatManager';

export const filterHourOptions = (deadLine: { date: string; time: string }) => {
  const { date, time } = deadLine;
  const today = new Date().toISOString().slice(0, 10);

  if (date !== today) return DEFAULT_HOUR_OPTIONS;

  const [targetHour] = FormatManager.parseHourMinute(time);

  return DEFAULT_HOUR_OPTIONS.filter((option) => {
    const [optionHour] = FormatManager.parseHourMinute(option);
    return targetHour < optionHour;
  });
};
