export const LAUNCH_DATE = new Date("2026-09-01T00:00:00+07:00");

export type TimeLeft = {
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
};

export function getTimeLeft(target: Date = LAUNCH_DATE): TimeLeft {
  const total = Math.max(0, target.getTime() - Date.now());

  const hours = Math.floor(total / (1000 * 60 * 60));
  const minutes = Math.floor((total / (1000 * 60)) % 60);
  const seconds = Math.floor((total / 1000) % 60);

  return { hours, minutes, seconds, total };
}