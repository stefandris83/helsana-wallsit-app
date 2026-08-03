import { Icon } from './Icon';

export interface CheckListProps {
  items: string[];
}

/**
 * Aufzaehlung mit Haken-Bullet (design-system.md Kapitel 9.1).
 *
 * Das Icon liegt in einem Slot von 16 x 24 px — 24 px ist die Zeilenhoehe von
 * `body-m-copy`. Dadurch sitzt der Haken optisch mittig auf der ersten Textzeile,
 * unabhaengig von Textlaenge, Viewportbreite und Textzoom.
 */
export function CheckList({ items }: CheckListProps) {
  return (
    <ul className="flex flex-col gap-snail list-none p-none m-none body-m-copy">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-snail">
          <span className="flex h-cat w-rat items-center justify-center">
            <Icon name="checkmark" size={16} />
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
