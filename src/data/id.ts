/** Erzeugt eine lokale, nicht personenbezogene Kennung. */
export function createId(prefix: string): string {
  const globalCrypto = typeof globalThis === 'undefined' ? undefined : globalThis.crypto;
  if (globalCrypto && typeof globalCrypto.randomUUID === 'function') {
    return `${prefix}_${globalCrypto.randomUUID()}`;
  }
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
}
