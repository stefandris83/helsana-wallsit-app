/// <reference types="vitest/config" />
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Basis-Pfad der Auslieferung. Lokal `/`, auf GitHub Pages `/<repository>/`
 * (wird im Deploy-Workflow gesetzt). Der Wert steht im Client als
 * `import.meta.env.BASE_URL` und wird dort als Router-Basename verwendet.
 */
const basePath = process.env.BASE_PATH ?? '/';

/**
 * Ersetzt `%APP_BASE%` in der `index.html` durch den Basis-Pfad.
 *
 * Manifest und Icons brauchen absolute Pfade: Beim Reload einer Unterseite
 * (z. B. `/helsana-wallsit-app/heute`) liefert GitHub Pages die `404.html` aus.
 * Ein relativer Verweis wuerde dann gegen `/heute/` aufgeloest und ins Leere
 * zeigen. Innerhalb des Manifests bleiben die Pfade relativ — sie werden gegen
 * die Manifest-Adresse aufgeloest und sind damit ohnehin unabhaengig vom Basis-Pfad.
 */
function appBasePlaceholder(): Plugin {
  return {
    name: 'app-base-placeholder',
    transformIndexHtml(html) {
      return html.replaceAll('%APP_BASE%', basePath);
    },
  };
}

/**
 * GitHub Pages liefert fuer unbekannte Pfade `404.html` aus. Da die App eine
 * Single-Page-Anwendung mit echten Pfaden ist (z. B. `/heute`), wird die
 * `index.html` als `404.html` dupliziert: ein Direktaufruf oder Reload einer
 * Unterseite laedt damit dieselbe Anwendung, die den Pfad selbst aufloest.
 * `.nojekyll` verhindert die Jekyll-Verarbeitung der Build-Artefakte.
 */
function githubPagesFallback(): Plugin {
  return {
    name: 'github-pages-fallback',
    apply: 'build',
    closeBundle() {
      const outDir = resolve(process.cwd(), 'dist');
      const html = readFileSync(resolve(outDir, 'index.html'), 'utf8');
      writeFileSync(resolve(outDir, '404.html'), html);
      writeFileSync(resolve(outDir, '.nojekyll'), '');
    },
  };
}

export default defineConfig({
  base: basePath,
  plugins: [react(), appBasePlaceholder(), githubPagesFallback()],
  resolve: {
    alias: {
      '@': new URL('./src', import.meta.url).pathname,
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    restoreMocks: true,
    /**
     * Feste Testkonfiguration der Berichtsablage. Ohne sie haetten die Tests
     * je nach lokal vorhandener `.env.local` ein anderes Ergebnis; der
     * Endpunkt ist erfunden und wird in den Tests ohnehin abgefangen.
     */
    env: {
      VITE_REPORT_UPLOAD_URL: 'https://ablage.example.invalid',
      VITE_REPORT_UPLOAD_KEY: 'test-schluessel',
      VITE_REPORT_UPLOAD_BUCKET: 'berichte',
    },
  },
});
