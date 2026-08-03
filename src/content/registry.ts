import type { ContentEntry } from './types';
import { commonContent } from './texts/common';
import {
  onboardingAccessContent,
  onboardingPlanContent,
  onboardingProfileContent,
  onboardingQuestionnaireContent,
} from './texts/onboarding';
import {
  checkinContent,
  feedbackContent,
  instructionContent,
  timerContent,
  todayContent,
} from './texts/training';
import { progressContent } from './texts/progress';
import { learningCardContent } from './learning-cards';
import { bpMeasurementInfoContent } from './bp-measurement-info';
import { bloodPressureContent } from './texts/blood-pressure';
import { notificationContent } from './texts/notifications';
import { settingsContent } from './texts/settings';
import { adminContent } from './texts/admin';
import { errorContent } from './texts/errors';

/**
 * Zentrale Content-Registry (CLAUDE.md B.5, spec.md §28).
 *
 * Komponenten und Screens referenzieren ausschliesslich Content-IDs aus dieser
 * Registry. Kundensichtbare Textliterale im UI-Code sind nicht zulaessig.
 */
export const contentRegistry = {
  ...commonContent,
  ...onboardingAccessContent,
  ...onboardingProfileContent,
  ...onboardingQuestionnaireContent,
  ...onboardingPlanContent,
  ...todayContent,
  ...checkinContent,
  ...instructionContent,
  ...timerContent,
  ...feedbackContent,
  ...progressContent,
  ...learningCardContent,
  ...bpMeasurementInfoContent,
  ...bloodPressureContent,
  ...notificationContent,
  ...settingsContent,
  ...adminContent,
  ...errorContent,
};

export type ContentId = keyof typeof contentRegistry;

export type ContentParams = Record<string, string | number>;

function interpolate(text: string, params?: ContentParams): string {
  if (!params) return text;
  return text.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in params ? String(params[key]) : match,
  );
}

/** Liefert den Text zu einer Content-ID. Platzhalter im Format `{name}`. */
export function t(id: ContentId, params?: ContentParams): string {
  const entry = contentRegistry[id] as ContentEntry;
  if (entry.text === undefined) {
    throw new Error(`Content-Eintrag "${String(id)}" hat kein Textfeld.`);
  }
  return interpolate(entry.text, params);
}

/** Liefert eine Aufzaehlung zu einer Content-ID. */
export function tList(id: ContentId): string[] {
  const entry = contentRegistry[id] as ContentEntry;
  return entry.items ?? [];
}

/** Liefert ein benanntes Teilfeld zu einer Content-ID. */
export function tField(id: ContentId, field: string, params?: ContentParams): string {
  const entry = contentRegistry[id] as ContentEntry;
  const value = entry.fields?.[field];
  if (value === undefined) {
    throw new Error(`Content-Eintrag "${String(id)}" hat kein Feld "${field}".`);
  }
  return interpolate(value, params);
}

/** Liefert ein Teilfeld, das nicht bei jedem Eintrag vorkommt (z. B. Sicherheitshinweis). */
export function tFieldOptional(id: ContentId, field: string): string | null {
  const entry = contentRegistry[id] as ContentEntry;
  return entry.fields?.[field] ?? null;
}

/** Liefert den vollstaendigen Eintrag inklusive Metadaten. */
export function contentEntry(id: ContentId): ContentEntry {
  return contentRegistry[id] as ContentEntry;
}

export function allContentEntries(): ContentEntry[] {
  return Object.values(contentRegistry) as ContentEntry[];
}

/** Alle Texte eines Eintrags, unabhaengig davon, in welchem Feld sie liegen. */
export function entryTexts(entry: ContentEntry): string[] {
  return [
    ...(entry.text === undefined ? [] : [entry.text]),
    ...(entry.items ?? []),
    ...Object.values(entry.fields ?? {}),
  ];
}
