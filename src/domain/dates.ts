import type { ClockTime, IsoDate, Weekday } from './types';
import { weekdayOrder } from './types';

/** Datums- und Zeit-Hilfsfunktionen. Arbeiten durchgehend in lokaler Zeit. */

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function toIsoDate(date: Date): IsoDate {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function fromIsoDate(value: IsoDate): Date {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, (month ?? 1) - 1, day ?? 1);
}

export function isValidIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = fromIsoDate(value);
  return !Number.isNaN(date.getTime()) && toIsoDate(date) === value;
}

export function isValidClockTime(value: string): boolean {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}

export function addDays(date: IsoDate, days: number): IsoDate {
  const base = fromIsoDate(date);
  base.setDate(base.getDate() + days);
  return toIsoDate(base);
}

/** Ganze Kalendertage zwischen zwei Daten (b - a). */
export function daysBetween(a: IsoDate, b: IsoDate): number {
  const start = fromIsoDate(a).getTime();
  const end = fromIsoDate(b).getTime();
  return Math.round((end - start) / MS_PER_DAY);
}

export function weekdayOf(date: IsoDate): Weekday {
  const index = fromIsoDate(date).getDay(); // 0 = Sonntag
  return weekdayOrder[(index + 6) % 7];
}

/** Montag der Kalenderwoche, in der das Datum liegt. */
export function startOfCalendarWeek(date: IsoDate): IsoDate {
  const index = fromIsoDate(date).getDay(); // 0 = Sonntag
  return addDays(date, -((index + 6) % 7));
}

/** Montag der folgenden Kalenderwoche. */
export function startOfNextCalendarWeek(date: IsoDate): IsoDate {
  return addDays(startOfCalendarWeek(date), 7);
}

export function clockTimeOf(date: Date): ClockTime {
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

export function clockTimeToMinutes(time: ClockTime): number {
  const [hours, minutes] = time.split(':').map(Number);
  return (hours ?? 0) * 60 + (minutes ?? 0);
}

/** Formatiert Sekunden als `M:SS`. */
export function formatDuration(totalSeconds: number): string {
  const safe = Math.max(0, Math.round(totalSeconds));
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

/** Formatiert ein ISO-Datum als `TT.MM.JJJJ` (Schweizer Schreibweise). */
export function formatIsoDate(value: IsoDate): string {
  const date = fromIsoDate(value);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}.${month}.${date.getFullYear()}`;
}
