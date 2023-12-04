import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { DocumentRevisionEntity } from "entities/Document/Document/Revision";

import { DocumentRevisionActiveAutomaticallyService } from "./active-automatically";
import { DocumentRevisionArchiveAutomaticallyService } from "./archive-automatically";
import { EditDocumentRevisionStatusService } from "./edit-status";

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([DocumentRevisionEntity])],
  providers: [
    DocumentRevisionActiveAutomaticallyService,
    DocumentRevisionArchiveAutomaticallyService,
    EditDocumentRevisionStatusService,
  ],
  exports: [
    DocumentRevisionActiveAutomaticallyService,
    DocumentRevisionArchiveAutomaticallyService,
    EditDocumentRevisionStatusService,
  ],
})
export class DocumentRevisionsModule {}
