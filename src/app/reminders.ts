import { clockTimeOf, clockTimeToMinutes, toIsoDate, weekdayOf } from '../domain/dates';
import type { ClockTime, IsoDate } from '../domain/types';
import type { ParticipantData } from '../data/participant';

/**
 * Lokale Erinnerungsplanung (CLAUDE.md B.13.2, spec.md §24).
 *
 * Es gibt kein Push-Backend und keinen Service Worker. Faellige Erinnerungen
 * erscheinen als In-App-Hinweis; zusaetzlich kann — nach ausdruecklicher
 * Zustimmung — die Benachrichtigungsschnittstelle des Browsers genutzt werden.
 * Erinnerungstexte enthalten nie Messwerte.
 */

export const QUIET_HOURS_START = 22 * 60;
export const QUIET_HOURS_END = 7 * 60;

export type ReminderKind = 'training' | 'blood-pressure';

export interface DueReminder {
  kind: ReminderKind;
  date: IsoDate;
  time: ClockTime;
}

export function isQuietTime(time: ClockTime): boolean {
  const minutes = clockTimeToMinutes(time);
  return minutes >= QUIET_HOURS_START || minutes < QUIET_HOURS_END;
}

/**
 * Ermittelt die aktuell faellige Erinnerung. Faellig heisst: geplante Uhrzeit
 * ist erreicht, liegt hoechstens vier Stunden zurueck und faellt nicht in die
 * Ruhezeit.
 */
export function findDueReminder(
  participant: ParticipantData,
  now: Date,
  alreadyShown: readonly string[],
): DueReminder | null {
  const date = toIsoDate(now);
  const current = clockTimeToMinutes(clockTimeOf(now));
  const withinWindow = (target: ClockTime) => {
    const minutes = clockTimeToMinutes(target);
    return current >= minutes && current - minutes <= 4 * 60 && !isQuietTime(target);
  };

  const { reminders, plan } = participant;

  if (reminders.trainingEnabled && plan) {
    // Vor dem gewaehlten Programmstart gibt es nichts zu erinnern (§14, B.13.1).
    const isTrainingDay = date >= plan.startDate && plan.trainingDays.includes(weekdayOf(date));
    const alreadyDone = participant.sessions.some((session) => session.date === date);
    const key = `training:${date}`;
    if (
      isTrainingDay &&
      !alreadyDone &&
      withinWindow(reminders.trainingTime) &&
      !alreadyShown.includes(key)
    ) {
      return { kind: 'training', date, time: reminders.trainingTime };
    }
  }

  if (reminders.bpEnabled) {
    for (const time of [reminders.bpMorningTime, reminders.bpEveningTime]) {
      const key = `bp:${date}:${time}`;
      if (withinWindow(time) && !alreadyShown.includes(key)) {
        return { kind: 'blood-pressure', date, time };
      }
    }
  }

  return null;
}

export function reminderKey(reminder: DueReminder): string {
  return reminder.kind === 'training'
    ? `training:${reminder.date}`
    : `bp:${reminder.date}:${reminder.time}`;
}

export type NotificationPermissionState = 'unsupported' | 'granted' | 'denied' | 'default';

export function notificationPermission(): NotificationPermissionState {
  if (typeof window === 'undefined' || !('Notification' in window)) return 'unsupported';
  return Notification.permission as NotificationPermissionState;
}

/** Fragt die Berechtigung ausschliesslich auf ausdrueckliche Nutzeraktion hin an. */
export async function requestNotificationPermission(): Promise<NotificationPermissionState> {
  if (notificationPermission() === 'unsupported') return 'unsupported';
  const result = await Notification.requestPermission();
  return result as NotificationPermissionState;
}

/** Zeigt eine Systembenachrichtigung ohne jeden Messwert im Text. */
export function showSystemNotification(title: string, body: string): void {
  if (notificationPermission() !== 'granted') return;
  new Notification(title, { body });
}
