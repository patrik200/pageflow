import { DateMode, IntlDate } from "@worksolutions/utils";
import { Logger, ConsoleLogger } from "@nestjs/common";
import { EventEmitter2 } from "eventemitter2";

import { europeDateFormats } from "modules/intl/intlConfig";

const intlDate = new IntlDate({ languageCode: "ru", matchDateModeAndLuxonTypeLiteral: europeDateFormats });

function getTimestamp() {
  return intlDate.formatDate(intlDate.getCurrentDateTime(), DateMode.DATE_TIME_WITH_SECONDS);
}

export function patchLogger(logEventEmitter: boolean) {
  // @ts-ignore
  ConsoleLogger.prototype.getTimestamp = getTimestamp;
  Logger.getTimestamp = getTimestamp;

  if (!logEventEmitter) return;
  const originalEmit = EventEmitter2.prototype.emit;
  EventEmitter2.prototype.emit = function (this: any, ...args) {
    Logger.log(args, "Event emitter sync event");
    console.trace();
    return originalEmit.apply(this, args);
  };

  const originalEmitAsync = EventEmitter2.prototype.emitAsync;
  EventEmitter2.prototype.emitAsync = function (this: any, ...args) {
    Logger.log(args, "Event emitter async event");
    console.trace();
    return originalEmitAsync.apply(this, args);
  };
}
