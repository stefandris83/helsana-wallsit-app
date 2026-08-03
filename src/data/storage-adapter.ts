/**
 * Persistenzschicht (CLAUDE.md B.4).
 *
 * Alle Lese- und Schreibzugriffe der Anwendungslogik laufen ueber dieses
 * Interface. Im MVP ist ausschliesslich der lokale Browser-Speicher aktiv;
 * Teilnehmerdaten verlassen das Geraet nicht.
 */

export const STORAGE_KEYS = {
  /** Identitaetsdaten: Zugangscode, Pilot-ID, optionale Kontaktangabe. */
  identity: 'hw.identity.v1',
  /** Nutzungsdaten: Profil, Fragebogen, Plan, Einheiten, Einstellungen. */
  participant: 'hw.participant.v1',
  /** Append-only Ereignis-Log (§27). */
  events: 'hw.events.v1',
  /** Blutdrucktagebuch (§23). */
  bloodPressure: 'hw.bp.v1',
  /** Protokoll administrativer Zugriffe (§30). */
  adminLog: 'hw.admin.v1',
  /** Laufender Timerzustand (B.7). */
  timer: 'hw.timer.v1',
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

export interface StorageAdapter {
  read<T>(key: StorageKey): T | null;
  /** Schreibt unmittelbar und atomar. Gibt `false` zurueck, wenn das Schreiben scheitert. */
  write<T>(key: StorageKey, value: T): boolean;
  remove(key: StorageKey): void;
  clearAll(): void;
}

/** Adapter fuer Umgebungen ohne `localStorage` (Tests, privater Modus). */
export class MemoryStorageAdapter implements StorageAdapter {
  private store = new Map<StorageKey, string>();

  read<T>(key: StorageKey): T | null {
    const raw = this.store.get(key);
    if (raw === undefined) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  write<T>(key: StorageKey, value: T): boolean {
    this.store.set(key, JSON.stringify(value));
    return true;
  }

  remove(key: StorageKey): void {
    this.store.delete(key);
  }

  clearAll(): void {
    this.store.clear();
  }
}

export class LocalStorageAdapter implements StorageAdapter {
  constructor(private readonly storage: Storage) {}

  read<T>(key: StorageKey): T | null {
    try {
      const raw = this.storage.getItem(key);
      if (raw === null) return null;
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  write<T>(key: StorageKey, value: T): boolean {
    try {
      this.storage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      // Privater Modus oder voller Speicher: der Aufrufer zeigt einen Hinweis.
      return false;
    }
  }

  remove(key: StorageKey): void {
    try {
      this.storage.removeItem(key);
    } catch {
      // bewusst ignoriert
    }
  }

  clearAll(): void {
    for (const key of Object.values(STORAGE_KEYS)) {
      this.remove(key);
    }
  }
}

/**
 * Dokumentierter, NICHT aktivierter Stub fuer eine spaetere serverseitige
 * Ablage (B.4).
 *
 * Vorgesehene Schnittstelle im Betrieb:
 *   - Transport ausschliesslich ueber TLS gegen einen Helsana-Endpunkt
 *   - Authentisierung ueber ein kurzlebiges Token der Pilotplattform
 *   - Schluessel bleiben identisch; die Pilot-ID wird serverseitig zugeordnet
 *   - Identitaetsdaten werden in einem getrennten Dienst gefuehrt (§8)
 *
 * Der Stub wirft bewusst, damit er nicht versehentlich produktiv verwendet wird.
 */
export class RemoteStorageAdapterStub implements StorageAdapter {
  static readonly enabled = false;

  private fail(): never {
    throw new Error(
      'RemoteStorageAdapterStub ist im MVP nicht aktiviert. Siehe docs/schnittstellen.md.',
    );
  }

  read(): never {
    this.fail();
  }

  write(): never {
    this.fail();
  }

  remove(): void {
    this.fail();
  }

  clearAll(): void {
    this.fail();
  }
}

function createDefaultAdapter(): StorageAdapter {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const probe = '__hw_probe__';
      window.localStorage.setItem(probe, '1');
      window.localStorage.removeItem(probe);
      return new LocalStorageAdapter(window.localStorage);
    }
  } catch {
    // Faellt auf den Speicher im Arbeitsspeicher zurueck.
  }
  return new MemoryStorageAdapter();
}

let adapter: StorageAdapter = createDefaultAdapter();

export function getStorageAdapter(): StorageAdapter {
  return adapter;
}

/** Nur fuer Tests und Demoumgebungen. */
export function setStorageAdapter(next: StorageAdapter): void {
  adapter = next;
}
