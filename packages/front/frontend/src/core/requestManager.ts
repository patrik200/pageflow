import { RequestManager } from "@app/kit";
import { createRequestManager, getVariable } from "@app/front-kit";

export class NestRequestManager extends RequestManager {}
export const getNestRequestManager = () =>
  createRequestManager(`http://${getVariable("nestHost")}:${getVariable("nestPort")}/api`, NestRequestManager);
