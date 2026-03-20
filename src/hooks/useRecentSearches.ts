"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "searchlens:recent-searches";
const MAX_ITEMS = 6;

// Stable empty array — same reference every time
const EMPTY: string[] = [];

let listeners: (() => void)[] = [];
let cachedSnapshot: string[] = EMPTY;
let cachedRaw: string | null = null;

function emitChange() {
  // Invalidate cache so next getSnapshot() re-reads
  cachedRaw = null;
  for (const listener of listeners) listener();
}

function getSnapshot(): string[] {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    // Return cached result if localStorage hasn't changed
    if (raw === cachedRaw) return cachedSnapshot;
    cachedRaw = raw;
    cachedSnapshot = raw ? (JSON.parse(raw) as string[]) : EMPTY;
    return cachedSnapshot;
  } catch {
    return EMPTY;
  }
}

function getServerSnapshot(): string[] {
  return EMPTY;
}

function subscribe(listener: () => void) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

export function useRecentSearches() {
  const searches = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const add = useCallback((query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    const current = getSnapshot();
    const next = [trimmed, ...current.filter((q) => q !== trimmed)].slice(0, MAX_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    emitChange();
  }, []);

  const remove = useCallback((query: string) => {
    const current = getSnapshot();
    const next = current.filter((q) => q !== query);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    emitChange();
  }, []);

  const clear = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    emitChange();
  }, []);

  return { searches, add, remove, clear };
}
