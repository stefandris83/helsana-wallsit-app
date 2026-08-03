import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Dialog } from '../../components/Dialog';
import { SelectField, TextAreaField, TextField } from '../../components/Fields';
import { t } from '../../content/registry';
import { daypartLabels } from '../../content/mappings';
import { clockTimeOf, isValidClockTime, isValidIsoDate, toIsoDate } from '../../domain/dates';
import type { BpDaypart } from '../../domain/types';
import type { BpEntryInput } from '../../data/bp-repository';
import { findDuplicateBpEntry } from '../../data/bp-repository';
import { useAppStore } from '../../data/store';

interface Errors {
  date?: string;
  time?: string;
  systolic?: string;
  diastolic?: string;
  pulse?: string;
}

interface Draft {
  date: string;
  time: string;
  systolic: string;
  diastolic: string;
  pulse: string;
  note: string;
  daypart: BpDaypart;
}

/**
 * Validierung der Eingaben (§23). Reine Plausibilitaetsgrenzen der Eingabe,
 * keine medizinische Bewertung und keine Kategorisierung.
 */
export function validateBpDraft(draft: Draft): { errors: Errors; input: BpEntryInput | null } {
  const errors: Errors = {};

  if (!isValidIsoDate(draft.date)) errors.date = t('bp.form.error.date');
  if (!isValidClockTime(draft.time)) errors.time = t('bp.form.error.time');

  const systolic = Number.parseInt(draft.systolic, 10);
  if (!Number.isFinite(systolic) || systolic < 50 || systolic > 300) {
    errors.systolic = t('bp.form.error.systolic');
  }

  const diastolic = Number.parseInt(draft.diastolic, 10);
  if (!Number.isFinite(diastolic) || diastolic < 30 || diastolic > 200) {
    errors.diastolic = t('bp.form.error.diastolic');
  }

  if (
    errors.systolic === undefined &&
    errors.diastolic === undefined &&
    systolic <= diastolic
  ) {
    errors.diastolic = t('bp.form.error.order');
  }

  let pulse: number | null = null;
  if (draft.pulse.trim() !== '') {
    const parsed = Number.parseInt(draft.pulse, 10);
    if (!Number.isFinite(parsed) || parsed < 20 || parsed > 250) {
      errors.pulse = t('bp.form.error.pulse');
    } else {
      pulse = parsed;
    }
  }

  if (Object.keys(errors).length > 0) return { errors, input: null };

  return {
    errors,
    input: {
      date: draft.date,
      time: draft.time,
      systolic,
      diastolic,
      pulse,
      note: draft.note.trim() === '' ? null : draft.note.trim(),
      daypart: draft.daypart,
    },
  };
}

/** Erfassen und Bearbeiten eines Eintrags (§23). */
export function BpFormScreen() {
  const navigate = useNavigate();
  const { entryId } = useParams();
  const entries = useAppStore((state) => state.bpEntries);
  const addBpEntry = useAppStore((state) => state.addBpEntry);
  const editBpEntry = useAppStore((state) => state.editBpEntry);

  const existing = entries.find((entry) => entry.id === entryId) ?? null;

  const [draft, setDraft] = useState<Draft>(() =>
    existing
      ? {
          date: existing.date,
          time: existing.time,
          systolic: String(existing.systolic),
          diastolic: String(existing.diastolic),
          pulse: existing.pulse === null ? '' : String(existing.pulse),
          note: existing.note ?? '',
          daypart: existing.daypart,
        }
      : {
          date: toIsoDate(new Date()),
          time: clockTimeOf(new Date()),
          systolic: '',
          diastolic: '',
          pulse: '',
          note: '',
          daypart: 'unspecified',
        },
  );
  const [errors, setErrors] = useState<Errors>({});
  const [duplicate, setDuplicate] = useState<BpEntryInput | null>(null);

  const update = (patch: Partial<Draft>) => setDraft((current) => ({ ...current, ...patch }));

  const persist = (input: BpEntryInput) => {
    if (existing) {
      editBpEntry(existing.id, input);
    } else {
      addBpEntry(input);
    }
    navigate('/blutdruck', { replace: true });
  };

  const submit = () => {
    const result = validateBpDraft(draft);
    setErrors(result.errors);
    if (!result.input) return;
    const found = findDuplicateBpEntry(result.input, existing?.id);
    if (found) {
      setDuplicate(result.input);
      return;
    }
    persist(result.input);
  };

  return (
    <div className="flex flex-col gap-cat">
      <h1 className="h2">{existing ? t('bp.form.title.edit') : t('bp.form.title.create')}</h1>

      <Dialog
        open={duplicate !== null}
        title={t('bp.duplicate.title')}
        description={t('bp.duplicate.text')}
        confirmLabel={t('bp.duplicate.saveAnyway')}
        cancelLabel={t('bp.duplicate.discard')}
        onConfirm={() => {
          if (duplicate) persist(duplicate);
          setDuplicate(null);
        }}
        onCancel={() => setDuplicate(null)}
      />

      <Card>
        <div className="flex flex-col gap-rat">
          <TextField
            type="date"
            label={t('bp.form.date')}
            value={draft.date}
            onChange={(event) => update({ date: event.target.value })}
            error={errors.date}
          />
          <TextField
            type="time"
            label={t('bp.form.time')}
            value={draft.time}
            onChange={(event) => update({ time: event.target.value })}
            error={errors.time}
          />
          <TextField
            inputMode="numeric"
            label={t('bp.form.systolic')}
            hint={t('bp.form.unitMmhg')}
            value={draft.systolic}
            onChange={(event) => update({ systolic: event.target.value })}
            error={errors.systolic}
          />
          <TextField
            inputMode="numeric"
            label={t('bp.form.diastolic')}
            hint={t('bp.form.unitMmhg')}
            value={draft.diastolic}
            onChange={(event) => update({ diastolic: event.target.value })}
            error={errors.diastolic}
          />
        </div>
      </Card>

      <Card>
        <div className="flex flex-col gap-rat">
          <p className="body-s text-secondary">{t('common.optionalHint')}</p>
          <TextField
            inputMode="numeric"
            label={t('bp.form.pulse')}
            hint={t('bp.form.unitBpm')}
            value={draft.pulse}
            onChange={(event) => update({ pulse: event.target.value })}
            error={errors.pulse}
          />
          <SelectField
            label={t('bp.form.daypart')}
            value={draft.daypart}
            onChange={(event) => update({ daypart: event.target.value as BpDaypart })}
            options={(['unspecified', 'morning', 'evening'] as BpDaypart[]).map((value) => ({
              value,
              label: t(daypartLabels[value]),
            }))}
          />
          <TextAreaField
            label={t('bp.form.note')}
            hint={t('bp.form.noteHint')}
            maxLength={280}
            value={draft.note}
            onChange={(event) => update({ note: event.target.value })}
          />
        </div>
      </Card>

      <Button block onClick={submit}>
        {t('bp.form.save')}
      </Button>
      <Button variant="secondary" block onClick={() => navigate('/blutdruck')}>
        {t('action.cancel')}
      </Button>
    </div>
  );
}
