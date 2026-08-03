import { Icon } from './Icon';

export interface ErrorListProps {
  items: string[];
}

/**
 * Aufzaehlung typischer Fehler mit Alert-Icon-Bullet.
 * Verwendet fuer "Typische Ausführungsfehler" in der Anleitung (§17).
 */
export function ErrorList({ items }: ErrorListProps) {
  return (
    <ul className="flex flex-col gap-snail list-none p-none m-none body-m-copy">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-snail text-status-red-secondary">
          <span className="flex h-cat w-rat shrink-0 items-center justify-center">
            <Icon name="alert-circle" size={16} />
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
