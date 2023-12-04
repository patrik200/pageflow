import { classToPlain, plainToClass } from "class-transformer";
import { action, computed, makeObservable } from "mobx";
import { ContainerInstance } from "typedi";
import { isArray } from "@worksolutions/utils";

import { getClassTransformerFieldMetadataType } from "./getClassFieldMetadataType";

export abstract class Storage {
  protected initStorage(token: string, runObserversOnNode?: boolean) {
    storagesMap.add(token, this.constructor);
    if (typeof window === "undefined" && !runObserversOnNode) return;
    this.disableEnumerableForMobx("restore");
    makeObservable(this);
  }

  protected disableEnumerableForMobx(fieldName: string) {
    Object.defineProperty(this, fieldName, { enumerable: false, writable: true, value: (this as any)[fieldName] });
  }

  @computed get plainObject() {
    return classToPlain(this, { strategy: "excludeAll" });
  }

  private setThisValue(key: string, value: any) {
    (this as any)[key] = value;
  }

  // eslint-disable-next-line unused-imports/no-unused-vars
  @action restore = (data: Record<string, any>, containerInstance: ContainerInstance) => {
    const keys = Object.keys(data);
    keys.forEach((key) => {
      const metadataClass = getClassTransformerFieldMetadataType(this, key);
      const fieldValue = data[key];
      const fieldIsArray = isArray(fieldValue);

      if (!metadataClass) {
        this.setThisValue(key, data[key]);
        return;
      }

      if (!fieldIsArray) {
        this.setThisValue(key, plainToClass(metadataClass, fieldValue, { exposeDefaultValues: true }));
        return;
      }

      this.setThisValue(
        key,
        fieldValue.map((value) => plainToClass(metadataClass, value, { exposeDefaultValues: true })),
      );
    });
  };
}

class StoragesMap {
  private storages = new Map<string, Function>();

  add(token: string, storageInstance: Function) {
    this.storages.set(token, storageInstance);
  }

  get(token: string) {
    return this.storages.get(token)!;
  }
}

export const storagesMap = new StoragesMap();
