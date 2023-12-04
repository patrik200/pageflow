import ms from "ms";

export function cachedProperty(
  ttl: string | -1,
  keyFunc: (...args: any[]) => string = JSON.stringify,
): MethodDecorator {
  return (target, propertyKey, descriptor) => {
    const time = ttl === -1 ? Infinity : ms(ttl);
    const cache = new Map<any, { createdAt: number; value: any }>();
    const originalFunction = descriptor.value! as any;
    descriptor.value = function (this: any, ...args: any[]) {
      const key = keyFunc(...args);
      const cacheElement = cache.get(key);
      const now = Date.now();
      if (cacheElement && now - cacheElement.createdAt < time) return cacheElement.value;

      const newValue = originalFunction.apply(this, args);
      cache.set(key, { value: newValue, createdAt: now });
      return newValue;
    } as any;
  };
}
