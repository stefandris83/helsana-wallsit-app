import logoUrl from '../assets/helsana-logo.svg';
import { t } from '../content/registry';

/**
 * Offizielle Helsana-Wortmarke, bezogen von helsana.ch am 31.07.2026 mit
 * ausdruecklicher Freigabe des Auftraggebers (CLAUDE.md, Abschnitt
 * «Fehlende Assets»). Ersetzt den zuvor dokumentierten Platzhalter-Slot.
 *
 * Die Datei traegt fest die Helsana-Markenfarbe aus dem Corporate Design und
 * ist damit modusunabhaengig. Die weisse Flaeche dahinter (`constant-white`, laut
 * design-system.md Kapitel 3.5 ausdruecklich fuer nie invertierende Elemente
 * vorgesehen) sichert im Dark-Modus ausreichenden Kontrast zur dunklen
 * Kopfzeile; im Light-Modus ist sie auf dem weissen Header unsichtbar. Die
 * Originaldatei bleibt dabei unveraendert.
 */
export function HelsanaLogo({ className }: { className?: string }) {
  return (
    <span
      className={['inline-flex items-center rounded-md bg-constant-white p-bee', className ?? '']
        .filter(Boolean)
        .join(' ')}
    >
      <img src={logoUrl} alt={t('app.logoAlt')} className="h-cat w-auto" />
    </span>
  );
}
