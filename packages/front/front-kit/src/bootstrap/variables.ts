import { Constructable, ContainerInstance } from "typedi";
import { RequestManager } from "@app/kit";

const variables = {
  nestHost: null! as string,
  nestPort: null! as number,
  customRequestManagers: null! as Map<typeof RequestManager, () => RequestManager>,
  globalContainerInstancesSetter: null! as (
    containerInstance: ContainerInstance,
    resolve: <T>(type: Constructable<T>) => T,
  ) => void,
  getAcceptLanguage: null! as (container: ContainerInstance) => string,
  setAcceptLanguage: null! as (acceptLanguage: string, container: ContainerInstance) => void,
};

type KEYS = keyof typeof variables;

type VALUE<KEY extends KEYS> = (typeof variables)[KEY];

export type InternalVariables = typeof variables;

export function setVariable<KEY extends KEYS>(key: KEY, value: VALUE<KEY>) {
  variables[key] = value;
}

export function getVariable<KEY extends KEYS>(key: KEY): VALUE<KEY> {
  return variables[key];
}
