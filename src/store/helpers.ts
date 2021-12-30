export function saveState(key: string, value: any): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getSavedState(key: string): any {
  return localStorage.getItem(JSON.parse(key));
}
