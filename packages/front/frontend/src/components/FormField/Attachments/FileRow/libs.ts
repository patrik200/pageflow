import { Ext, documentExtensionPresets, DocumentExtensionsPresets } from "@app/shared-enums";

export function getFormatImageByFileName(name: string) {
  const preset = getPresetByFileName(name);
  if (!preset) return "/images/file_formats/file.svg";
  return "/images/file_formats/" + preset + ".svg";
}

export function getPresetByFileName(name: string) {
  if (!name) return null;
  const extensionPart = name.split(".").at(-1);
  if (!extensionPart) return null;
  const ext = ("." + extensionPart.toLowerCase()) as Ext;
  for (const [presetName, extensions] of Object.entries(documentExtensionPresets)) {
    if (extensions.has(ext)) return presetName as keyof DocumentExtensionsPresets;
  }
  return null;
}
