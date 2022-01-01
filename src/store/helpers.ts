export function saveState<State>(key: string, value: State): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getSavedState<State>(key: string): State | undefined {
  const value = localStorage.getItem(key);

  if (!value) return undefined;
  return JSON.parse(value);
}
