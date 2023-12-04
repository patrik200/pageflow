import { Injectable } from "@nestjs/common";
import { IntlDate } from "@worksolutions/utils";

export enum INTLServiceLang {
  RU = "INTL_RU",
}

@Injectable()
export class INTLService extends IntlDate {}
