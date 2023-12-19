import { Global, Module } from "@nestjs/common";

import { ImageProcessingService } from "./service";

@Global()
@Module({
  providers: [ImageProcessingService],
  exports: [ImageProcessingService],
})
export class ImageProcessingModule {}

export { ImageProcessingService } from "./service";
