export class SimpleMemoryDataSaver {
  private data = new Map<string, { removingTimer: NodeJS.Timeout; value: any }>();

  constructor(private config: { ttlMS: number }) {}

  set<T = any>(key: string, value: T) {
    const current = this.data.get(key);
    if (current) clearTimeout(current.removingTimer);
    this.data.set(key, { removingTimer: setTimeout(() => this.data.delete(key), this.config.ttlMS), value });
  }

  get<T = any>(key: string) {
    return this.data.get(key)?.value as T | undefined;
  }

  delete(key: string) {
    const current = this.data.get(key);
    if (!current) return;
    clearTimeout(current.removingTimer);
    this.data.delete(key);
  }
}
