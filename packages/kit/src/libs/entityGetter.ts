type Entity<KEY extends string> = { [key in KEY]: string };

export function entityGetter<ENTITY extends Entity<KEY>, KEY extends string>(entity: ENTITY[], id: string, key: KEY) {
  const index = entity.findIndex((entity) => entity[key] === id);
  if (index === -1) return null;
  return { index, entity: entity[index] };
}

export type EntityGetterResult<ENTITY extends Entity<KEY>, KEY extends string> = null | {
  index: number;
  entity: ENTITY;
};
