import { Ext } from "./ext";

export type DocumentExtensionsPresets = Record<"image" | "pdf" | "word" | "excel", Set<Ext>>;

export const documentExtensionPresets: DocumentExtensionsPresets = {
  image: new Set([
    ".webp" as Ext,
    ".jpg" as Ext,
    ".jpeg" as Ext,
    ".png" as Ext,
    ".bmp" as Ext,
    ".svg" as Ext,
    ".gif" as Ext,
  ]),
  pdf: new Set([".pdf" as Ext]),
  word: new Set([".docx" as Ext, ".doc" as Ext, ".txt" as Ext]),
  excel: new Set([".xlsx" as Ext, ".xls" as Ext]),
};

export const resizableImageExtensionPreset = new Set(documentExtensionPresets.image);
resizableImageExtensionPreset.delete(".svg" as Ext);
resizableImageExtensionPreset.delete(".gif" as Ext);
