import { Global, Module } from "@nestjs/common";

import { DocumentGroupPermissionsController } from "./controller";
import { CreateDocumentGroupPermissionsService } from "./create";
import { DeleteDocumentGroupPermissionsService } from "./delete";
import { EditDocumentGroupPermissionsService } from "./edit";

@Global()
@Module({
  controllers: [DocumentGroupPermissionsController],
  providers: [
    CreateDocumentGroupPermissionsService,
    DeleteDocumentGroupPermissionsService,
    EditDocumentGroupPermissionsService,
  ],
  exports: [
    CreateDocumentGroupPermissionsService,
    DeleteDocumentGroupPermissionsService,
    EditDocumentGroupPermissionsService,
  ],
})
export class DocumentsGroupPermissionsModule {}

export * from "./create";
export * from "./delete";
export * from "./edit";
