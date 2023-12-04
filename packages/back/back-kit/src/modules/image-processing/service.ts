import { Injectable } from "@nestjs/common";
import sharp, { OverlayOptions, Region, ResizeOptions, Sharp } from "sharp";
import { streamToBuffer } from "@jorgeferrero/stream-to-buffer";

@Injectable()
export class ImageProcessingService {
  private sharp!: Sharp;

  initFromBuffer(buffer: Buffer) {
    const imageProcessingService = new ImageProcessingService();
    imageProcessingService.sharp = sharp(buffer);
    return imageProcessingService;
  }

  async initFromReadableStream(stream: NodeJS.ReadableStream) {
    return this.initFromBuffer(await streamToBuffer(stream));
  }

  initFromSharpInstance(sharp: Sharp) {
    const imageProcessingService = new ImageProcessingService();
    imageProcessingService.sharp = sharp;
    return imageProcessingService;
  }

  getSharpStream() {
    return this.sharp;
  }

  resize(options: ResizeOptions) {
    this.sharp.resize(options);
    return this;
  }

  async toBuffer() {
    const { data, info } = await this.sharp.toBuffer({ resolveWithObject: true });
    return { buffer: data, info };
  }

  setFormat(...args: Parameters<Sharp["toFormat"]>) {
    this.sharp.toFormat(...args);
    return this;
  }

  clone() {
    return this.initFromSharpInstance(this.sharp.clone());
  }

  metadata() {
    return this.sharp.metadata();
  }

  extract(region: Region) {
    this.sharp.extract(region);
    return this;
  }

  composite(layers: OverlayOptions[]) {
    this.sharp.composite(layers);
    return this;
  }
}
