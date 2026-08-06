import { t } from '../content/registry';
import { formatIsoDate } from '../domain/dates';
import type { BpEntry } from '../domain/types';

/**
 * Verlaufsgrafik der selbst gemessenen Blutdruckwerte (freigegeben durch den
 * Auftraggeber am 06.08.2026 fuer den Pilot).
 *
 * REGULATORISCHE GRENZE (spec.md §3): Die Grafik stellt ausschliesslich die
 * eingegebenen Zahlen ueber die Zeit dar. Sie enthaelt bewusst
 *   - keine Zielbereiche, Normbaender oder Kategoriezonen,
 *   - keine Ampel- oder Statusfarben,
 *   - keine Trainingsdaten in derselben Darstellung,
 *   - keinen Mittelwert und keine Trendlinie.
 * Farben kommen ausschliesslich aus dekorativen Tokens; die Zuordnung der
 * Linien steht zusaetzlich als Text in der Legende, damit die Farbe nicht
 * alleiniger Bedeutungstraeger ist (CLAUDE.md B.8).
 */

const WIDTH = 320;
const HEIGHT = 170;
const PADDING = { top: 12, right: 8, bottom: 26, left: 34 };

export interface BpChartProps {
  entries: readonly BpEntry[];
  /** Ueberschrift der Textalternative, z. B. die Pilotnummer im Dashboard. */
  captionSuffix?: string;
}

interface Point {
  x: number;
  y: number;
}

function toTime(entry: BpEntry): number {
  return new Date(`${entry.date}T${entry.time || '00:00'}:00`).getTime();
}

function polyline(points: Point[]): string {
  return points.map((point) => `${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(' ');
}

export function BpChart({ entries, captionSuffix }: BpChartProps) {
  const sorted = [...entries].sort((a, b) => toTime(a) - toTime(b));

  if (sorted.length < 2) {
    return <p className="body-m text-secondary">{t('bp.chart.tooFew')}</p>;
  }

  const values = sorted.flatMap((entry) => [entry.systolic, entry.diastolic]);
  const rawMin = Math.min(...values);
  const rawMax = Math.max(...values);
  // Rand von 5 mmHg, damit die Linien nicht am Rahmen kleben. Keine Skala mit
  // medizinischer Bedeutung: die Achse folgt allein den eingegebenen Zahlen.
  const min = Math.floor((rawMin - 5) / 5) * 5;
  const max = Math.ceil((rawMax + 5) / 5) * 5;
  const span = Math.max(1, max - min);

  const first = toTime(sorted[0]);
  const last = toTime(sorted[sorted.length - 1]);
  const timeSpan = Math.max(1, last - first);

  const plotWidth = WIDTH - PADDING.left - PADDING.right;
  const plotHeight = HEIGHT - PADDING.top - PADDING.bottom;

  const toPoint = (entry: BpEntry, value: number): Point => ({
    x: PADDING.left + ((toTime(entry) - first) / timeSpan) * plotWidth,
    y: PADDING.top + (1 - (value - min) / span) * plotHeight,
  });

  const systolic = sorted.map((entry) => toPoint(entry, entry.systolic));
  const diastolic = sorted.map((entry) => toPoint(entry, entry.diastolic));

  const baseline = PADDING.top + plotHeight;
  const label = t('bp.chart.alt', { count: sorted.length });

  return (
    <div className="flex flex-col gap-frog">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="u-bp-chart w-full h-auto"
        role="img"
        aria-label={label}
      >
        <line
          className="u-bp-chart__axis"
          x1={PADDING.left}
          y1={PADDING.top}
          x2={PADDING.left}
          y2={baseline}
        />
        <line
          className="u-bp-chart__axis"
          x1={PADDING.left}
          y1={baseline}
          x2={WIDTH - PADDING.right}
          y2={baseline}
        />

        <text className="u-bp-chart__tick" x={PADDING.left - 4} y={PADDING.top + 4} textAnchor="end">
          {max}
        </text>
        <text className="u-bp-chart__tick" x={PADDING.left - 4} y={baseline} textAnchor="end">
          {min}
        </text>
        <text className="u-bp-chart__tick" x={PADDING.left} y={HEIGHT - 8}>
          {formatIsoDate(sorted[0].date)}
        </text>
        <text className="u-bp-chart__tick" x={WIDTH - PADDING.right} y={HEIGHT - 8} textAnchor="end">
          {formatIsoDate(sorted[sorted.length - 1].date)}
        </text>

        <polyline className="u-bp-chart__systolic" fill="none" points={polyline(systolic)} />
        <polyline className="u-bp-chart__diastolic" fill="none" points={polyline(diastolic)} />
        {systolic.map((point, index) => (
          <circle key={`s${index}`} className="u-bp-chart__dot-systolic" cx={point.x} cy={point.y} r={2.5} />
        ))}
        {diastolic.map((point, index) => (
          <circle key={`d${index}`} className="u-bp-chart__dot-diastolic" cx={point.x} cy={point.y} r={2.5} />
        ))}
      </svg>

      <ul className="flex flex-wrap gap-rat list-none p-none m-none helper-m">
        <li className="flex items-center gap-ant">
          <span className="u-bp-chart__key u-bp-chart__key--systolic" aria-hidden="true" />
          {t('bp.chart.systolic')}
        </li>
        <li className="flex items-center gap-ant">
          <span className="u-bp-chart__key u-bp-chart__key--diastolic" aria-hidden="true" />
          {t('bp.chart.diastolic')}
        </li>
      </ul>

      {/* Textalternative: die Grafik ist nicht der einzige Zugang zu den Zahlen. */}
      <table className="u-visually-hidden">
        <caption>{captionSuffix ? `${label} — ${captionSuffix}` : label}</caption>
        <thead>
          <tr>
            <th scope="col">{t('bp.chart.columnDate')}</th>
            <th scope="col">{t('bp.chart.systolic')}</th>
            <th scope="col">{t('bp.chart.diastolic')}</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((entry) => (
            <tr key={entry.id}>
              <th scope="row">{formatIsoDate(entry.date)}</th>
              <td>{entry.systolic}</td>
              <td>{entry.diastolic}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
