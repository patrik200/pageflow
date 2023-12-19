import { Injectable } from "@nestjs/common";
import { Response } from "express";
import * as mime from "mime-types";
import { parseNum } from "@app/core-config";

import { StorageGetService } from "./services/get";
import { ImageVariantsService } from "./services/image-variants";

interface FileOptions {
  bucket: string;
  id: string;
  mode: "any" | "onlyPublic";
}

@Injectable()
export class StorageControllerService {
  constructor(private storageGetService: StorageGetService, private imageVariantsService: ImageVariantsService) {}

  private static setContentType(res: Response, id: string) {
    const mimeType = mime.lookup(id);
    res.setHeader("Content-Type", mimeType || "application/octet-stream");
  }

  private async sendImageFileWithResize(res: Response, { bucket, id, mode }: FileOptions, width: number) {
    // add onlyPublic mode to stream
    const stream = await this.imageVariantsService.getVariantStreamOrCreate(bucket, id, [
      { key: "width", value: width },
    ]);
    if (!stream) return await this.sendDefaultFileStream(res, { bucket, id, mode });
    StorageControllerService.setContentType(res, id);
    stream.pipe(res);
  }

  private async sendDefaultFileStream(res: Response, { id, bucket, mode }: FileOptions) {
    const stream = await this.storageGetService.getFileStream({ bucket, id, onlyPublic: mode === "onlyPublic" });
    if (!stream) return res.send(null);
    StorageControllerService.setContentType(res, id);
    stream.pipe(res);
  }

  async file(res: Response, options: FileOptions, { width: imageVariantWidth }: { width?: string } = {}) {
    if (!imageVariantWidth) return await this.sendDefaultFileStream(res, options);
    const parsedWidth = parseNum(imageVariantWidth, 0);
    if (parsedWidth === 0) return await this.sendDefaultFileStream(res, options);
    await this.sendImageFileWithResize(res, options, parsedWidth);
  }
}

export * from "./services/extensions";
export * from "./services/file-uploader";
export * from "./services/get";
export * from "./services/image-variants";
export * from "./services/save";
