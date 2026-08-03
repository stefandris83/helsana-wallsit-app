export interface NumberedListProps {
  items: string[];
}

/**
 * Aufzaehlung mit nummeriertem Kreis-Bullet (design-system.md Kapitel 12.18,
 * Stepper-Kreis 24 x 24px), fuer Schritt-fuer-Schritt-Anleitungen. Kreis in
 * `interactive-primary` (Helsana-Rot) mit weisser Ziffer statt Haken, da die
 * Reihenfolge der Schritte hier die relevante Information ist.
 */
export function NumberedList({ items }: NumberedListProps) {
  return (
    <ol className="flex flex-col gap-snail list-none p-none m-none body-m-copy">
      {items.map((item, index) => (
        <li key={item} className="flex items-start gap-snail">
          <span className="flex h-cat w-cat shrink-0 items-center justify-center rounded-full bg-interactive-primary">
            <span className="body-s-bold text-on-interactive-primary">{index + 1}</span>
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ol>
  );
}
