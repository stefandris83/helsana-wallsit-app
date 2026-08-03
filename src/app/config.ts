/**
 * Konfiguration aus Umgebungsvariablen. Enthaelt keine Secrets im Repository;
 * Beispielwerte stehen in `.env.example`.
 */

function readString(value: string | undefined): string {
  return (value ?? '').trim();
}

export const config = {
  /**
   * Zugangscode fuer den Admin-Bereich. KEIN produktiver
   * Authentisierungsmechanismus (CLAUDE.md B.9).
   */
  adminCode: readString(import.meta.env.VITE_ADMIN_CODE),
  /** Quelle des Anleitungsvideos (§17, B.13.4). Leer => Platzhalter. */
  instructionVideoUrl: readString(import.meta.env.VITE_INSTRUCTION_VIDEO_URL),
  instructionVideoTrackUrl: readString(import.meta.env.VITE_INSTRUCTION_VIDEO_TRACK_URL),
  /** Feature-Flag «Pause ueberspringen» (B.13.5). Standard: aus. */
  featureSkipRest: readString(import.meta.env.VITE_FEATURE_SKIP_REST) === 'true',
  /** Mindestgruppengroesse fuer aggregierte Dashboard-Werte (B.13.7). */
  minGroupSize: Number.parseInt(readString(import.meta.env.VITE_MIN_GROUP_SIZE) || '5', 10) || 5,
} as const;
