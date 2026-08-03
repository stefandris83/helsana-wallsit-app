/**
 * Hoefliche Live-Region fuer Screenreader-Ansagen (CLAUDE.md B.7).
 * Angesagt werden Satzwechsel, Zwischenziel, Pausenbeginn und Abschluss —
 * bewusst keine sekuendliche Ansage.
 */
export interface LiveRegionProps {
  message: string;
}

export function LiveRegion({ message }: LiveRegionProps) {
  return (
    <p className="u-visually-hidden" role="status" aria-live="polite" aria-atomic="true">
      {message}
    </p>
  );
}
