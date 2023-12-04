import { plainToClassFromExist } from "class-transformer";
import type { Constructable } from "typedi";

import { BaseEntity } from "entities/BaseEntity";

function build<T>(plainInstance: T, getData?: (instance: T) => Object) {
  const plainData: Record<string, any> = getData ? getData(plainInstance) : {};

  const plainDataBaseEntities: Record<string, any> = {};
  const plainDataOthers: Record<string, any> = {};

  Object.keys(plainData).forEach((key) => {
    const value = plainData[key];
    if (BaseEntity.isBaseEntity(value) || (Array.isArray(value) && BaseEntity.isBaseEntity(value[0]))) {
      plainDataBaseEntities[key] = plainData[key];
    } else {
      plainDataOthers[key] = plainData[key];
    }
  });

  const instance = plainToClassFromExist(plainInstance, plainDataOthers, {
    enableImplicitConversion: false,
    exposeUnsetFields: false,
    exposeDefaultValues: false,
  });

  Object.keys(plainDataBaseEntities).forEach((key) => {
    (instance as any)[key] = plainDataBaseEntities[key];
  });

  if (BaseEntity.isBaseEntity(instance)) instance.__runOnBuildCallbacks();
  return instance;
}

export function makeTransformableObject<T>(Class: Constructable<T>, getData?: (instance: T) => Object) {
  return build(new Class(), getData);
}

export function makeFnTransformableObject<T>(fabric: () => T, getData?: (instance: T) => any) {
  return build(fabric(), getData);
}
