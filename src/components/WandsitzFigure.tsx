import femaleUrl from '../assets/wandsitz-frau.png';
import maleUrl from '../assets/wandsitz-mann.png';
import { t } from '../content/registry';
import type { Sex } from '../domain/types';

/**
 * Kleine Illustration der Uebungsposition auf dem Heute-Screen (§14).
 *
 * Die Darstellung richtet sich nach der Profilangabe zum Geschlecht (§11).
 * Die Zuordnung ist rein illustrativ: Sie waehlt ein Bild aus, leitet daraus
 * nichts ab und veraendert weder Trainingsinhalt noch Zielzeiten (§3).
 *
 * ASSET-HINWEIS: Die beiden Strichzeichnungen wurden vom Auftraggeber am
 * 01.08.2026 bereitgestellt und freigegeben. Sie liegen freigestellt und auf
 * 200 px Breite reduziert lokal im Repository; es wird nichts nachgeladen (B.2).
 * Fuer «Divers» liegt bisher keine eigene Zeichnung vor — bis dahin zeigt die
 * App dort dieselbe Position wie fuer «Weiblich»; beide Bilder stellen dieselbe
 * Uebung dar. Sobald eine dritte Zeichnung vorliegt, wird sie hier eingehaengt.
 */
const figures: Record<Sex, string> = {
  female: femaleUrl,
  male: maleUrl,
  diverse: femaleUrl,
  unspecified: femaleUrl,
};

export function WandsitzFigure({ sex, className }: { sex: Sex; className?: string }) {
  return (
    <span
      className={['inline-flex shrink-0 rounded-md bg-constant-white p-bee', className ?? '']
        .filter(Boolean)
        .join(' ')}
    >
      <img src={figures[sex]} alt={t('today.figureAlt')} className="h-elephant w-auto" />
    </span>
  );
}
