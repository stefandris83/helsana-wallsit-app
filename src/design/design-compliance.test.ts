import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Automatisierte Pruefung des Design Systems (CLAUDE.md B.8, spec.md §33).
 *
 * - keine Hex-Werte und keine Primitive-Tokens in `src/components` und `src/screens`
 * - keine Statusfarbe an Blutdruck- oder Fortschrittsdarstellungen
 * - keine arbitrary values der Tailwind-Syntax
 */

const ROOT = join(process.cwd(), 'src');

function collectFiles(dir: string): string[] {
  const result: string[] = [];
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) {
      result.push(...collectFiles(path));
      continue;
    }
    if (/\.(tsx|ts|css)$/.test(name) && !name.endsWith('.test.ts')) {
      result.push(path);
    }
  }
  return result;
}

const uiFiles = [...collectFiles(join(ROOT, 'components')), ...collectFiles(join(ROOT, 'screens'))];

/** Primitives aus design-system.md Kapitel 2. */
const primitivePattern =
  /\b(basic-(black|white)|(neutral|brand|pink|purple|blue|yellow|green|ecru)-[1-8]00|status-(red|green)-[1-8]00|black-opacity-\d+|white-opacity-\d+)\b/;

const hexPattern = /#[0-9a-fA-F]{3,8}\b/;

/** Arbitrary values wie `p-[13px]` oder `text-[#9A0941]`. */
const arbitraryValuePattern =
  /\b(?:p|px|py|pt|pr|pb|pl|m|mx|my|mt|mr|mb|ml|gap|w|h|min-w|min-h|max-w|max-h|text|bg|border|rounded|top|right|bottom|left|inset)-\[[^\]]+\]/;

describe('Design System «Unify»: Tokens im UI-Code (B.8)', () => {
  it('findet UI-Dateien zum Pruefen', () => {
    expect(uiFiles.length).toBeGreaterThan(20);
  });

  it.each(uiFiles.map((file) => [file.replace(`${process.cwd()}/`, '')] as const))(
    '%s enthaelt keinen Hex-Farbwert',
    (relative) => {
      const content = readFileSync(join(process.cwd(), relative), 'utf8');
      const match = hexPattern.exec(content);
      expect(match?.[0] ?? null).toBeNull();
    },
  );

  it.each(uiFiles.map((file) => [file.replace(`${process.cwd()}/`, '')] as const))(
    '%s verwendet kein Primitive-Token',
    (relative) => {
      const content = readFileSync(join(process.cwd(), relative), 'utf8');
      const match = primitivePattern.exec(content);
      expect(match?.[0] ?? null).toBeNull();
    },
  );

  it.each(uiFiles.map((file) => [file.replace(`${process.cwd()}/`, '')] as const))(
    '%s verwendet keine arbitrary values',
    (relative) => {
      const content = readFileSync(join(process.cwd(), relative), 'utf8');
      const match = arbitraryValuePattern.exec(content);
      expect(match?.[0] ?? null).toBeNull();
    },
  );
});

describe('Regulatorische Grenze vor Design System (§3, B.8)', () => {
  /**
   * Blutdruck-, Fortschritts- und Zieldarstellungen duerfen nichts farblich
   * bewerten. Der Trainingstimer zeigt Zwischen- und Zusatzziel und faellt
   * deshalb ebenfalls unter diese Regel (CLAUDE.md B.8).
   */
  const healthFiles = uiFiles.filter((file) =>
    /(blutdruck|fortschritt|ProgressRing|TimerScreen|BloodPressure|Bp[A-Z])/.test(file),
  );

  it('findet die betroffenen Dateien', () => {
    expect(healthFiles.length).toBeGreaterThan(0);
  });

  it.each(healthFiles.map((file) => [file.replace(`${process.cwd()}/`, '')] as const))(
    '%s verwendet kein Status-Farbtoken',
    (relative) => {
      const content = readFileSync(join(process.cwd(), relative), 'utf8');
      const match = /\b(?:bg|text|border|stroke|fill)-status-[a-z-]+/.exec(content);
      expect(match?.[0] ?? null).toBeNull();
    },
  );

  it.each(healthFiles.map((file) => [file.replace(`${process.cwd()}/`, '')] as const))(
    '%s nutzt keine bewertende Inline-Notification',
    (relative) => {
      const content = readFileSync(join(process.cwd(), relative), 'utf8');
      const match = /type="(success|error|warning)"/.exec(content);
      expect(match?.[0] ?? null).toBeNull();
    },
  );
});

describe('Token-Definitionsdatei', () => {
  it('haelt Primitives ausschliesslich in tokens.css', () => {
    const tokens = readFileSync(join(ROOT, 'design', 'tokens.css'), 'utf8');
    expect(hexPattern.test(tokens)).toBe(true);

    const componentsCss = readFileSync(join(ROOT, 'design', 'components.css'), 'utf8');
    expect(hexPattern.test(componentsCss)).toBe(false);
    expect(primitivePattern.test(componentsCss)).toBe(false);
  });

  it('legt alle vier Farbmodi an (Kapitel 10)', () => {
    const tokens = readFileSync(join(ROOT, 'design', 'tokens.css'), 'utf8');
    for (const mode of ['light', 'light-hc', 'dark', 'dark-hc']) {
      expect(tokens).toContain(`[data-color-mode='${mode}']`);
    }
    expect(tokens).toContain('prefers-color-scheme: dark');
  });
});
