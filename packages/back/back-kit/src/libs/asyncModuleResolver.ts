import { Type } from "@nestjs/common";
import { asyncTimeout } from "@worksolutions/utils";
import { Constructable } from "typedi";

type Resolver = <T>(module: Type<T> | string) => Promise<T>;

let moduleResolver: Resolver | null;

export function setModuleResolver(resolver: Resolver) {
  moduleResolver = resolver;
}

async function moduleOrNull<T>(moduleClass: Constructable<T> | string) {
  try {
    return await moduleResolver!(moduleClass);
  } catch (e) {
    return null;
  }
}

export async function asyncModuleResolver<T>(moduleClass: Constructable<T> | string, period = 200): Promise<T> {
  const module = await moduleOrNull(moduleClass);
  if (module) return module;
  await asyncTimeout(period);
  return asyncModuleResolver(moduleClass, period * 1.5);
}
