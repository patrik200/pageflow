import { ContainerInstance } from "typedi";

import { InternalRequestManager } from "framework/requestManagers";

import { getVariable } from "./variables";

export function getAllRequestManagers(container: ContainerInstance) {
  return [
    container.get(InternalRequestManager),
    ...[...getVariable("customRequestManagers").keys()].map((key) => container.get(key)),
  ];
}

export function getCoreKitCustomStorageClasses() {
  return [];
}
