import { Container, ContainerInstance, Constructable } from "typedi";
import uuid from "uuidjs";

import { createInternalRequestManager, InternalRequestManager } from "framework/requestManagers";
import { getCoreKitCustomStorageClasses } from "bootstrap/customVariableGetters";
import { getVariable } from "bootstrap/variables";

export function createScopedContainer() {
  const id = uuid.generate();
  const container = Container.of(id);

  if (typeof window === "undefined") {
    runServerLogic(container);
  } else {
    runClientLogic(container);
  }

  return { container, dispose: () => Container.reset(id) };
}

function callGlobalContainerInstancesSetter(container: ContainerInstance, resolve: <T>(type: Constructable<T>) => T) {
  getVariable("globalContainerInstancesSetter")(container, resolve);
  getCoreKitCustomStorageClasses().forEach((StorageClass) => container.set(StorageClass, resolve(StorageClass)));
}

function runServerLogic(container: ContainerInstance) {
  container.set(InternalRequestManager, createInternalRequestManager());
  getVariable("customRequestManagers").forEach((getReqManager, key) => container.set(key, getReqManager()));
  callGlobalContainerInstancesSetter(container, container.get.bind(container));
}

function runClientLogic(container: ContainerInstance) {
  if (!Container.has(InternalRequestManager)) Container.set(InternalRequestManager, createInternalRequestManager());
  container.set(InternalRequestManager, Container.get(InternalRequestManager));

  getVariable("customRequestManagers").forEach((getReqManager, key) => {
    if (!Container.has(key)) Container.set(key, getReqManager());
    container.set(key, Container.get(key));
  });

  callGlobalContainerInstancesSetter(container, Container.get.bind(Container));
}
