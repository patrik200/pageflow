import { BaseEntity } from "@app/kit";
import { parseServerErrorMessages, ParseServerErrorResult, TranslationFunction } from "@app/front-kit";

import { globalEventBus } from "./eventBus";
import { UpdateFileRequestResult } from "./storages/_common/updateFile";

export function emitRequestSuccess(message: string) {
  globalEventBus.emit("NOTIFICATION_SUCCESS", { message });
}

export function emitRequestError(
  entity: BaseEntity | undefined,
  error: ParseServerErrorResult,
  unexpectedErrorMessage: string,
) {
  parseServerErrorMessages(error, entity?.exposedKeys ?? [], {
    unexpectedError: () => globalEventBus.emit("NOTIFICATION_ERROR", { message: unexpectedErrorMessage }),
    stringError: (message) => globalEventBus.emit("NOTIFICATION_ERROR", { message }),
    fieldError: entity ? (field, message) => entity.setError(field, message) : undefined,
  });
}

export function emitRequestErrorFiles(
  results: {
    uploadResults: UpdateFileRequestResult[];
    deleteResults?: UpdateFileRequestResult[];
  },
  t: TranslationFunction,
) {
  let hasError = false;
  results.uploadResults.forEach((result) => {
    if (result.status !== "upload-error") return;
    hasError = true;
    globalEventBus.emit("NOTIFICATION_WARNING", {
      message: t(
        { scope: "common:file_uploader_errors", name: "upload_error" },
        { name: result.uploadableFile.fileName },
      ),
    });
  });

  results.deleteResults?.forEach((result) => {
    if (result.status !== "delete-error") return;
    hasError = true;
    globalEventBus.emit("NOTIFICATION_WARNING", {
      message: t(
        { scope: "common:file_uploader_errors", name: "delete_error" },
        { name: result.deletableFile.fileName },
      ),
    });
  });

  return hasError;
}
