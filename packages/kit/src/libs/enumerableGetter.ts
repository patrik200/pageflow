export function enumerableGetter<INSTANCE extends InstanceType<any>>(instance: INSTANCE, key: keyof INSTANCE) {
  const proxyKey = "_" + (key as string);
  Object.defineProperty(instance, key, {
    enumerable: true,
    get: () => (instance as any)[proxyKey],
  });
}
