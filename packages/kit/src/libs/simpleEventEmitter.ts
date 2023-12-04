export class SimpleEventEmitter {
  setMaxListeners() {}

  private events = new Map<string, Set<Function>>();

  emit(type: string, payload: any) {
    this.events.get(type)?.forEach((func) => func(payload));
  }

  removeListener(type: string, handler: Function) {
    const functions = this.events.get(type);
    if (functions) functions.delete(handler);
  }

  addListener(type: string, handler: Function) {
    if (!this.events.has(type)) this.events.set(type, new Set());
    this.events.get(type)!.add(handler);
  }

  once(type: string, handler: Function) {
    const eventHandler = (...data: any[]) => {
      handler(...data);
      this.removeListener(type, eventHandler);
    };

    this.addListener(type, eventHandler);
  }
}
