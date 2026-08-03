import type { ReactNode } from 'react';

/**
 * Fortschrittsring des Trainingstimers (spec.md §18).
 *
 * Farblogik:
 * - Bis zum Zwischenziel faerbt sich der gefuellte Bogen mit zunehmender
 *   Zielnaehe von `text-primary` in das dekorative Helsana-Gruen ein
 *   (`decorative-green-darker`). Beim Zwischenziel ist er vollstaendig gruen.
 * - In der freiwilligen Zusatzphase bleibt der bereits erreichte Anteil gruen
 *   stehen, die Zusatzzeit laeuft in `text-decorative` weiter.
 *
 * Verwendet werden ausschliesslich dekorative Semantic Tokens, keine
 * Status-Tokens: die Darstellung bewertet keinen Trainingszustand (CLAUDE.md B.8).
 */
export interface ProgressRingProps {
  /** Gefuellter Anteil zwischen 0 und 1. */
  progress: number;
  /** Anteil des Rings, der auf das erreichte Zwischenziel entfaellt (0..1). */
  targetShare: number;
  /** Annaeherung an das Zwischenziel (0 = neutral, 1 = gruen). */
  targetApproach: number;
  inOptionalPhase: boolean;
  children: ReactNode;
  /** Textalternative fuer Screenreader. */
  label: string;
}

const SIZE = 240;
const STROKE = 12;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function clamp(value: number): number {
  return Math.min(1, Math.max(0, value));
}

interface ArcProps {
  from: number;
  to: number;
  className: string;
  opacity?: number;
}

/** Kreisbogen von `from` bis `to`, jeweils als Anteil des Vollkreises. */
function Arc({ from, to, className, opacity }: ArcProps) {
  const start = clamp(from);
  const end = clamp(to);
  const length = Math.max(0, end - start) * CIRCUMFERENCE;
  if (length <= 0) return null;
  return (
    <circle
      className={className}
      cx={SIZE / 2}
      cy={SIZE / 2}
      r={RADIUS}
      fill="none"
      strokeWidth={STROKE}
      strokeLinecap="round"
      strokeDasharray={`${length} ${CIRCUMFERENCE - length}`}
      strokeDashoffset={-start * CIRCUMFERENCE}
      opacity={opacity}
      transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
    />
  );
}

export function ProgressRing({
  progress,
  targetShare,
  targetApproach,
  inOptionalPhase,
  children,
  label,
}: ProgressRingProps) {
  const filled = clamp(progress);
  const share = clamp(targetShare);
  const approach = clamp(targetApproach);

  return (
    <div className="u-progress-ring">
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full h-auto" role="img" aria-label={label}>
        <circle
          className="u-progress-ring__track"
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          strokeWidth={STROKE}
        />

        {inOptionalPhase ? (
          <>
            {/* Bereits erreichtes Zwischenziel bleibt sichtbar. */}
            <Arc from={0} to={Math.min(share, filled)} className="u-progress-ring__reached" />
            <Arc from={share} to={filled} className="u-progress-ring__optional" />
          </>
        ) : (
          <>
            <Arc from={0} to={filled} className="u-progress-ring__value" />
            {/*
              Gruene Einfaerbung waechst mit der Naehe zum Zwischenziel. Der
              quadratische Verlauf haelt den Ring am Anfang neutral und laesst
              das Gruen erst gegen das Ziel hin deutlich werden; beim
              Zwischenziel ist er vollstaendig gruen.
            */}
            <Arc
              from={0}
              to={filled}
              className="u-progress-ring__reached"
              opacity={approach * approach}
            />
          </>
        )}
      </svg>
      <div className="absolute inset-none flex flex-col items-center justify-center text-center">
        {children}
      </div>
    </div>
  );
}
