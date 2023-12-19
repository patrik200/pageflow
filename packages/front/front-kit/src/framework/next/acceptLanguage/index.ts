import { ContainerInstance } from "typedi";
import { getAllRequestManagers } from "bootstrap";

import { getVariable } from "bootstrap/variables";
import { ServerSidePropsContext } from "framework/page";

import { prepareRequestManagerToSendAcceptLanguage } from "./prepareRequestManagerToSendAcceptLanguage";

export function initializeAcceptLanguage(container: ContainerInstance) {
  getAllRequestManagers(container).forEach((rm) => prepareRequestManagerToSendAcceptLanguage(container, rm));
}

export function initializeAcceptLanguageByContext(context: ServerSidePropsContext, container: ContainerInstance) {
  getVariable("setAcceptLanguage")(context.locale, container);
  initializeAcceptLanguage(container);
}
