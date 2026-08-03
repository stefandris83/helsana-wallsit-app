import type { DayCell } from '../domain/progress';
import { weekdayOf } from '../domain/dates';
import { formatIsoDate } from '../domain/dates';
import { weekdayShortLabels } from '../content/mappings';
import { t } from '../content/registry';
import { weekdayOrder } from '../domain/types';
import { Icon } from './Icon';

/**
 * Eine Programmwoche als Streifen von Montag bis Sonntag.
 *
 * Ohne bewertende Farbe: erledigte und geplante Tage unterscheiden sich ueber
 * Flaeche und Symbol, nie ueber Farbe allein (CLAUDE.md B.8, design-system.md
 * Kapitel 13).
 */
export interface WeekStripProps {
  days: DayCell[];
  /** Spaltenkoepfe Mo–So anzeigen. */
  showHeader?: boolean;
}

export function WeekStrip({ days, showHeader = false }: WeekStripProps) {
  return (
    <div className="flex flex-col gap-bee">
      {showHeader ? (
        <div className="grid grid-cols-7 gap-bee helper-m text-secondary">
          {weekdayOrder.map((day) => (
            <span key={day} className="text-center">
              {t(weekdayShortLabels[day])}
            </span>
          ))}
        </div>
      ) : null}

      <div className="grid grid-cols-7 gap-bee">
        {days.map((day) => (
          <span
            key={day.date}
            title={formatIsoDate(day.date)}
            className={[
              'flex min-h-gorilla flex-col items-center justify-center gap-ant rounded p-ant helper-m',
              day.beforeStart
                ? 'text-disabled'
                : day.done
                  ? 'bg-background-medium-neutral text-primary'
                  : day.planned
                    ? 'bg-background-subtle-neutral text-secondary'
                    : 'text-tertiary',
              day.isToday ? 'u-today-cell' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {showHeader ? null : (
              <span className="text-secondary">{t(weekdayShortLabels[weekdayOf(day.date)])}</span>
            )}
            <span>{Number(day.date.slice(8, 10))}</span>
            {day.done ? (
              <Icon name="checkmark" size={16} label={t('progress.calendarLegendDone')} />
            ) : day.planned ? (
              <span aria-label={t('progress.calendarLegendPlanned')}>·</span>
            ) : null}
          </span>
        ))}
      </div>
    </div>
  );
}
