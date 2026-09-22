// ============================================================
// SKILLSWAP — localStorage Persistence Adapter
// ============================================================
// All read/write to localStorage lives here.
// To migrate to a real backend: replace these functions with
// fetch() calls and the rest of the app stays untouched.

import type { ApiResult, ApiError } from '@/types';

const PREFIX = 'skillswap_';

function key(name: string): string {
  return `${PREFIX}${name}`;
}

// ── Generic CRUD helpers ──────────────────────────────────────

export function storageGet<T>(name: string): T | null {
  try {
    const raw = localStorage.getItem(key(name));
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function storageSet<T>(name: string, value: T): void {
  try {
    localStorage.setItem(key(name), JSON.stringify(value));
  } catch (e) {
    console.error(`[SkillSwap] Failed to persist "${name}"`, e);
  }
}

export function storageRemove(name: string): void {
  localStorage.removeItem(key(name));
}

export function storageClear(): void {
  Object.keys(localStorage)
    .filter((k) => k.startsWith(PREFIX))
    .forEach((k) => localStorage.removeItem(k));
}

// ── Collection helpers ────────────────────────────────────────
// These simulate database table operations on arrays stored in localStorage.

export function collectionGet<T extends { id: string }>(name: string): T[] {
  return storageGet<T[]>(name) ?? [];
}

export function collectionGetById<T extends { id: string }>(
  name: string,
  id: string,
): T | null {
  const items = collectionGet<T>(name);
  return items.find((item) => item.id === id) ?? null;
}

export function collectionInsert<T extends { id: string }>(
  name: string,
  item: T,
): ApiResult<T> {
  const items = collectionGet<T>(name);
  if (items.some((i) => i.id === item.id)) {
    return {
      ok: false,
      error: mkError('DUPLICATE', `Item with id "${item.id}" already exists.`),
    };
  }
  items.push(item);
  storageSet(name, items);
  return { ok: true, data: item };
}

export function collectionUpdate<T extends { id: string }>(
  name: string,
  id: string,
  patch: Partial<T>,
): ApiResult<T> {
  const items = collectionGet<T>(name);
  const idx = items.findIndex((i) => i.id === id);
  if (idx === -1) {
    return {
      ok: false,
      error: mkError('NOT_FOUND', `Item with id "${id}" not found.`),
    };
  }
  const updated = { ...items[idx], ...patch } as T;
  items[idx] = updated;
  storageSet(name, items);
  return { ok: true, data: updated };
}

export function collectionDelete<T extends { id: string }>(
  name: string,
  id: string,
): ApiResult<{ id: string }> {
  const items = collectionGet<T>(name);
  const idx = items.findIndex((i) => i.id === id);
  if (idx === -1) {
    return {
      ok: false,
      error: mkError('NOT_FOUND', `Item with id "${id}" not found.`),
    };
  }
  items.splice(idx, 1);
  storageSet(name, items);
  return { ok: true, data: { id } };
}

// ── Error factory ─────────────────────────────────────────────

export function mkError(code: string, message: string): ApiError {
  return { code, message };
}

// ── ID generation ─────────────────────────────────────────────

export function generateId(prefix?: string): string {
  const rand = Math.random().toString(36).slice(2, 10);
  const ts = Date.now().toString(36);
  return prefix ? `${prefix}_${ts}${rand}` : `${ts}${rand}`;
}

