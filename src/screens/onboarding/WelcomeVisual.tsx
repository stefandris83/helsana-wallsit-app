import sicherheitUrl from '../../assets/onboarding-sicherheit.jpg';
import variantenUrl from '../../assets/onboarding-varianten.png';
import wallsitUrl from '../../assets/onboarding-wallsit.png';
import wocheUrl from '../../assets/onboarding-woche.png';

/**
 * Illustrationen des Willkommens-Carousels (§10).
 *
 * ASSET-HINWEIS: Die vier Illustrationen wurden vom Auftraggeber am 02.08.2026
 * bereitgestellt und freigegeben. Sie liegen lokal im Repository und wurden
 * ausschliesslich auf 640 x 426 px vereinheitlicht; inhaltlich sind sie
 * unveraendert (B.2 — es wird nichts von einem externen CDN nachgeladen).
 *
 * Alle vier haben dasselbe Seitenverhaeltnis, damit die Karten beim Blaettern
 * nicht in der Hoehe springen. Der Bildcontainer ist in beiden Farbmodi hell
 * (`bg-constant-white`), weil es Graustufen-Strichzeichnungen auf hellem Grund
 * sind — auf dunklem Grund waeren sie nicht lesbar. Gleiches Vorgehen wie bei
 * `WandsitzFigure`.
 */
export type WelcomeVisualKind = 'wallsit' | 'week' | 'variants' | 'safety';

const sources: Record<WelcomeVisualKind, string> = {
  wallsit: wallsitUrl,
  week: wocheUrl,
  variants: variantenUrl,
  safety: sicherheitUrl,
};

export function WelcomeVisual({ kind, label }: { kind: WelcomeVisualKind; label: string }) {
  return (
    <div className="overflow-hidden rounded-md bg-constant-white">
      <img src={sources[kind]} alt={label} className="block h-auto w-full" />
    </div>
  );
}
