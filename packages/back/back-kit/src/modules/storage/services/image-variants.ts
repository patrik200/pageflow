import { Injectable } from "@nestjs/common";
import path from "path";
import { Transactional } from "typeorm-transactional";
import { resizableImageExtensionPreset } from "@app/shared-enums";

import { ImageProcessingService } from "modules/image-processing/service";

import { StorageGetService } from "./get";
import { StorageSaveService } from "./save";

interface ImageVariantServiceVariantInterface {
  key: "width";
  value: number;
}

@Injectable()
export class ImageVariantsService {
  private static isResizableImage(id: string) {
    const ext = StorageGetService.getExtensionOrFail(id);
    return resizableImageExtensionPreset.has(ext);
  }

  private static getVariantFileId(fileId: string, variants: ImageVariantServiceVariantInterface[]) {
    const ext = path.extname(fileId);
    const leftPart = `${path.basename(fileId, ext)}__`;
    const centerPart = variants.map(({ key, value }) => `${key}_${value}`).join("__");
    return `${leftPart}${centerPart}${ext}`;
  }

  constructor(
    private storageGetService: StorageGetService,
    private storageSaveService: StorageSaveService,
    private imageProcessingService: ImageProcessingService,
  ) {}

  @Transactional()
  async getVariantStreamOrCreate(bucket: string, id: string, variants: ImageVariantServiceVariantInterface[]) {
    if (!ImageVariantsService.isResizableImage(id)) return await this.storageGetService.getFileStream({ bucket, id });
    if (variants.length === 0) return await this.storageGetService.getFileStream({ bucket, id });
    const variantId = ImageVariantsService.getVariantFileId(id, variants);
    const fileExists = await this.storageGetService.fileExists({ bucket, id: variantId });
    if (fileExists) return this.storageGetService.getFileStream({ bucket, id: variantId });
    const streamData = await this.storageGetService.getFileStream({ bucket, id }, true);
    if (!streamData) return null;
    const ips = await this.imageProcessingService.initFromReadableStream(streamData.readableStream);

    const foundWidth = variants.find((variant) => variant.key === "width");
    if (foundWidth) ips.resize({ width: foundWidth.value });

    const sharpStream = ips.getSharpStream();
    await this.storageSaveService.addVariant(bucket, id, variantId);
    await this.storageSaveService.saveStream({ bucket, name: variantId, stream: sharpStream.clone() });
    return sharpStream;
  }
}
