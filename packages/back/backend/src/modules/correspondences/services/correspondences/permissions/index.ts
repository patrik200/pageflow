import { Global, Module } from "@nestjs/common";

import { CorrespondencePermissionsController } from "./controller";
import { CreateCorrespondencePermissionsService } from "./create";
import { DeleteCorrespondencePermissionsService } from "./delete";
import { EditCorrespondencePermissionsService } from "./edit";

@Global()
@Module({
  controllers: [CorrespondencePermissionsController],
  providers: [
    CreateCorrespondencePermissionsService,
    DeleteCorrespondencePermissionsService,
    EditCorrespondencePermissionsService,
  ],
  exports: [
    CreateCorrespondencePermissionsService,
    DeleteCorrespondencePermissionsService,
    EditCorrespondencePermissionsService,
  ],
})
export class CorrespondencesPermissionsModule {}

export * from "./create";
export * from "./delete";
export * from "./edit";
