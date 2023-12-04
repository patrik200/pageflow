import { Injectable } from "@nestjs/common";
import mime from "mime";
import { isArray } from "@worksolutions/utils";
import { documentExtensionPresets, DocumentExtensionsPresets, Ext } from "@app/shared-enums";

import { ServiceError } from "libs";

export type CompareDocumentExtensionPreset = keyof DocumentExtensionsPresets | (keyof DocumentExtensionsPresets)[];

@Injectable()
export class FileExtensionsService {
  getExtension(filePath: string) {
    const fileExtension = mime.extension(mime.lookup(filePath));
    if (!fileExtension) return null;
    return ("." + fileExtension) as Ext;
  }

  getExtensionOrFail(filePath: string) {
    const extension = this.getExtension(filePath);
    if (!extension) throw new ServiceError("file", "bad extension", 400);
    return extension;
  }

  compareDocumentExtensionPresetAndExtension(preset: CompareDocumentExtensionPreset, extension: Ext | null) {
    if (!extension) return false;
    if (isArray(preset)) return preset.some((preset) => documentExtensionPresets[preset].has(extension));
    return documentExtensionPresets[preset].has(extension);
  }
}
