/**
 * Icon-Set im Stil von Material Symbols «Rounded» (design-system.md Kapitel 9.1).
 *
 * ASSET-HINWEIS: Die offiziellen Material-Symbols-SVGs liegen im Projekt nicht
 * vor, und externe CDN sind ausgeschlossen (CLAUDE.md B.2). Die Glyphen sind
 * daher lokal vereinfacht nachgezeichnet, mit den Namen aus Kapitel 9.1 und den
 * Groessen 16/24/32 px. Vor dem Pilot sind sie durch die offiziellen Assets zu
 * ersetzen; die Komponentenschnittstelle bleibt dabei unveraendert.
 *
 * Farbe kommt immer ueber ein `text-*`-Token (currentColor).
 */

export type IconName =
  | 'home'
  | 'bar-chart'
  | 'menu-book'
  | 'health'
  | 'settings'
  | 'timer'
  | 'play'
  | 'pause'
  | 'close'
  | 'checkmark'
  | 'check-circle'
  | 'info-circle'
  | 'warning'
  | 'alert-circle'
  | 'cancel-circle'
  | 'chevron-left'
  | 'chevron-right'
  | 'chevron-up'
  | 'chevron-down'
  | 'arrow-right'
  | 'add'
  | 'edit'
  | 'delete'
  | 'download'
  | 'upload'
  | 'calendar'
  | 'clock'
  | 'notification'
  | 'replay'
  | 'lightbulb'
  | 'trophy'
  | 'cloud-offline'
  | 'user'
  | 'list-view'
  | 'lock'
  | 'logout';

const paths: Record<IconName, string> = {
  home: 'M4 20v-8.6a1 1 0 0 1 .4-.8l7-5.3a1 1 0 0 1 1.2 0l7 5.3a1 1 0 0 1 .4.8V20a1 1 0 0 1-1 1h-4.5v-5.5h-4.5V21H5a1 1 0 0 1-1-1z',
  'bar-chart':
    'M5 20a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H5zm6 0a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-2zm6 0a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-2z',
  'menu-book':
    'M4 4h5.5a3 3 0 0 1 2.5 1.4A3 3 0 0 1 14.5 4H20a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-5.5a1.5 1.5 0 0 0-1.4 1 1.2 1.2 0 0 1-2.2 0 1.5 1.5 0 0 0-1.4-1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1zm7 3.6A1.6 1.6 0 0 0 9.5 6H5v11h4.5c.5 0 1 .1 1.5.3V7.6zm2 9.7c.5-.2 1-.3 1.5-.3H19V6h-4.5A1.6 1.6 0 0 0 13 7.6v9.7z',
  health:
    'M12 20.4a1 1 0 0 1-.7-.3l-6-5.7A5.2 5.2 0 0 1 12 7.1a5.2 5.2 0 0 1 6.7 7.3l-6 5.7a1 1 0 0 1-.7.3z',
  settings:
    'M12 15.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4zm8-2.1v-2.2l-2-.5a6.4 6.4 0 0 0-.6-1.4l1.1-1.7-1.6-1.6-1.7 1.1a6.4 6.4 0 0 0-1.4-.6l-.5-2h-2.2l-.5 2c-.5.1-1 .3-1.4.6L7.5 5.7 5.9 7.3 7 9c-.3.4-.5.9-.6 1.4l-2 .5v2.2l2 .5c.1.5.3 1 .6 1.4l-1.1 1.7 1.6 1.6 1.7-1.1c.4.3.9.5 1.4.6l.5 2h2.2l.5-2c.5-.1 1-.3 1.4-.6l1.7 1.1 1.6-1.6-1.1-1.7c.3-.4.5-.9.6-1.4l2-.5z',
  timer:
    'M12 21a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm.9-8.4V8.9a.9.9 0 0 0-1.8 0v4a1 1 0 0 0 .3.7l2.5 2.5a.9.9 0 0 0 1.3-1.3l-2.3-2.2zM9 2h6a1 1 0 0 1 0 2H9a1 1 0 0 1 0-2z',
  play: 'M8 5.6c0-.8.9-1.3 1.6-.9l9 6.4a1.1 1.1 0 0 1 0 1.8l-9 6.4A1.1 1.1 0 0 1 8 18.4V5.6z',
  pause:
    'M8 4h2a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1zm6 0h2a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z',
  close:
    'M12 13.4l-4.6 4.6a1 1 0 0 1-1.4-1.4L10.6 12 6 7.4A1 1 0 0 1 7.4 6L12 10.6 16.6 6A1 1 0 0 1 18 7.4L13.4 12l4.6 4.6a1 1 0 0 1-1.4 1.4L12 13.4z',
  /*
   * Strichstaerke 2.8 statt 2: Der Haken erscheint auch in 16 px und auf
   * Bildschirmen mit niedriger Pixeldichte deutlich (design-system.md 9.1).
   */
  checkmark:
    'M9.6 17.7a1.4 1.4 0 0 1-1-.4l-4.7-4.7a1.4 1.4 0 0 1 2-2l3.7 3.7 9.5-9.5a1.4 1.4 0 0 1 2 2L10.6 17.3a1.4 1.4 0 0 1-1 .4z',
  'check-circle':
    'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-1.3 14.3-3.4-3.4a1 1 0 0 1 1.4-1.4l2.7 2.7 5.3-5.3a1 1 0 0 1 1.4 1.4l-6 6a1 1 0 0 1-1.4 0z',
  'info-circle':
    'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 4.5a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4zM13 17a1 1 0 0 1-2 0v-5a1 1 0 0 1 2 0v5z',
  warning:
    'M2.7 19.3 10.9 4.6a1.3 1.3 0 0 1 2.2 0l8.2 14.7a1.2 1.2 0 0 1-1.1 1.8H3.8a1.2 1.2 0 0 1-1.1-1.8zM12 9a1 1 0 0 0-1 1v3.5a1 1 0 0 0 2 0V10a1 1 0 0 0-1-1zm0 8.6a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4z',
  'alert-circle':
    'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 5a1 1 0 0 1 1 1v4.5a1 1 0 0 1-2 0V8a1 1 0 0 1 1-1zm0 11a1.3 1.3 0 1 1 0-2.6 1.3 1.3 0 0 1 0 2.6z',
  'cancel-circle':
    'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm3.5 12.1-2.1-2.1 2.1-2.1a1 1 0 0 0-1.4-1.4L12 10.6 9.9 8.5a1 1 0 0 0-1.4 1.4l2.1 2.1-2.1 2.1a1 1 0 1 0 1.4 1.4l2.1-2.1 2.1 2.1a1 1 0 0 0 1.4-1.4z',
  'chevron-left':
    'M14.7 18.3 8.4 12l6.3-6.3a1 1 0 0 1 1.4 1.4L11.2 12l4.9 4.9a1 1 0 0 1-1.4 1.4z',
  'chevron-right':
    'M9.3 5.7 15.6 12l-6.3 6.3a1 1 0 0 1-1.4-1.4l4.9-4.9-4.9-4.9a1 1 0 0 1 1.4-1.4z',
  'chevron-up': 'M5.7 14.7 12 8.4l6.3 6.3a1 1 0 0 1-1.4 1.4L12 11.2l-4.9 4.9a1 1 0 0 1-1.4-1.4z',
  'chevron-down': 'M18.3 9.3 12 15.6 5.7 9.3a1 1 0 0 1 1.4-1.4l4.9 4.9 4.9-4.9a1 1 0 0 1 1.4 1.4z',
  'arrow-right':
    'M13.3 4.3 20 11a1.4 1.4 0 0 1 0 2l-6.7 6.7a1 1 0 0 1-1.4-1.4l5-5H5a1 1 0 0 1 0-2h11.9l-5-5a1 1 0 0 1 1.4-1.4z',
  add: 'M11 11V5a1 1 0 0 1 2 0v6h6a1 1 0 0 1 0 2h-6v6a1 1 0 0 1-2 0v-6H5a1 1 0 0 1 0-2h6z',
  edit: 'M4 17.3V20h2.7L16.8 9.9l-2.7-2.7L4 17.3zm15.7-9.8a1 1 0 0 0 0-1.4l-1.8-1.8a1 1 0 0 0-1.4 0l-1.4 1.4 2.7 2.7 1.9-1.9z',
  delete:
    'M7 19a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V8H7v11zM17.5 5H15l-.7-.8a1 1 0 0 0-.7-.2h-3.2a1 1 0 0 0-.7.2L9 5H6.5a1 1 0 0 0 0 2h11a1 1 0 0 0 0-2z',
  download:
    'M12 15.6a1 1 0 0 1-.7-.3l-4-4a1 1 0 0 1 1.4-1.4l2.3 2.3V4a1 1 0 0 1 2 0v8.2l2.3-2.3a1 1 0 0 1 1.4 1.4l-4 4a1 1 0 0 1-.7.3zM5 18h14a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2z',
  upload:
    'M12 4a1 1 0 0 1 .7.3l4 4a1 1 0 1 1-1.4 1.4L13 7.4v8.2a1 1 0 0 1-2 0V7.4L8.7 9.7a1 1 0 0 1-1.4-1.4l4-4A1 1 0 0 1 12 4zM5 18h14a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2z',
  calendar:
    'M6 3a1 1 0 0 1 1 1v1h10V4a1 1 0 0 1 2 0v1a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2V4a1 1 0 0 1 1-1zM5 10v9h14v-9H5z',
  clock:
    'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm.9 9.6V6.9a.9.9 0 0 0-1.8 0V12a1 1 0 0 0 .3.7l3 3a.9.9 0 0 0 1.3-1.3l-2.8-2.8z',
  notification:
    'M12 21a2.2 2.2 0 0 0 2.2-2.2H9.8A2.2 2.2 0 0 0 12 21zm7-5.3-1.4-1.4V10a5.6 5.6 0 0 0-4.2-5.5V4a1.4 1.4 0 0 0-2.8 0v.5A5.6 5.6 0 0 0 6.4 10v4.3L5 15.7a1 1 0 0 0 .7 1.7h12.6a1 1 0 0 0 .7-1.7z',
  replay:
    'M12 5V2.5a.5.5 0 0 0-.8-.4L7.6 5a.5.5 0 0 0 0 .8l3.6 2.9a.5.5 0 0 0 .8-.4V7a5 5 0 1 1-5 5 1 1 0 0 0-2 0 7 7 0 1 0 7-7z',
  lightbulb:
    'M12 2a7 7 0 0 0-4 12.7V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.3A7 7 0 0 0 12 2zM9.5 19.5h5a1 1 0 0 1 0 2h-5a1 1 0 0 1 0-2z',
  trophy:
    'M18 4h2a1 1 0 0 1 1 1v2a4 4 0 0 1-3.6 4A6 6 0 0 1 13 14.9V18h3a1 1 0 0 1 0 2H8a1 1 0 0 1 0-2h3v-3.1A6 6 0 0 1 6.6 11 4 4 0 0 1 3 7V5a1 1 0 0 1 1-1h2V3h12v1zM6 6H5v1a2 2 0 0 0 1 1.7V6zm12 0v2.7A2 2 0 0 0 19 7V6h-1z',
  'cloud-offline':
    'M3.7 2.3a1 1 0 0 0-1.4 1.4l3 3A5.5 5.5 0 0 0 6.5 18h10.1l3.7 3.7a1 1 0 0 0 1.4-1.4L3.7 2.3zM18.5 9A6.5 6.5 0 0 0 7.9 4.6l1.5 1.5A4.5 4.5 0 0 1 16.5 9h.5a4 4 0 0 1 2.9 6.7l1.4 1.4A6 6 0 0 0 18.5 9z',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0 2c-3.6 0-7 1.8-7 4v1a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-1c0-2.2-3.4-4-7-4z',
  'list-view':
    'M4 6h2v2H4V6zm4 0h12a1 1 0 0 1 0 2H8a1 1 0 0 1 0-2zm-4 5h2v2H4v-2zm4 0h12a1 1 0 0 1 0 2H8a1 1 0 0 1 0-2zm-4 5h2v2H4v-2zm4 0h12a1 1 0 0 1 0 2H8a1 1 0 0 1 0-2z',
  lock: 'M12 2a4.5 4.5 0 0 0-4.5 4.5V9H7a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-.5V6.5A4.5 4.5 0 0 0 12 2zm2.5 7h-5V6.5a2.5 2.5 0 0 1 5 0V9z',
  logout:
    'M10 3a1 1 0 0 1 0 2H6v14h4a1 1 0 0 1 0 2H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5zm6.3 4.3 4 4a1 1 0 0 1 0 1.4l-4 4a1 1 0 0 1-1.4-1.4l2.3-2.3H10a1 1 0 0 1 0-2h7.2l-2.3-2.3a1 1 0 0 1 1.4-1.4z',
};

export type IconSize = 16 | 24 | 32;

export interface IconProps {
  name: IconName;
  size?: IconSize;
  className?: string;
  /** Beschriftung fuer Screenreader. Ohne Angabe gilt das Icon als dekorativ. */
  label?: string;
}

export function Icon({ name, size = 24, className, label }: IconProps) {
  /*
   * `shrink-0`: Als Flex-Kind wuerde das SVG sonst mit zunehmender Textlaenge
   * zusammengedrueckt — Icons erschienen je nach Zeile unterschiedlich gross.
   * Die Groesse kommt ausschliesslich aus `size` (16/24/32).
   */
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className ? `shrink-0 ${className}` : 'shrink-0'}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      {/* evenodd, damit innenliegende Aussparungen (z. B. beim Info-Kreis) offen bleiben. */}
      <path d={paths[name]} fillRule="evenodd" clipRule="evenodd" />
    </svg>
  );
}
