import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { DocumentRevisionEntity } from "entities/Document/Document/Revision";
import { DocumentRevisionFileEntity } from "entities/Document/Document/Revision/File";
import { DocumentRevisionReturnCountsEntity } from "entities/Document/Document/Revision/ReturnCount";
import { DocumentRevisionResponsibleUserEntity } from "entities/Document/Document/Revision/Approving/UserApproving";
import { DocumentGroupEntity } from "entities/Document/Group/group";
import { DocumentRevisionFavouriteEntity } from "entities/Document/Document/Revision/Favourite";
import { DocumentRevisionResponsibleUserFlowEntity } from "entities/Document/Document/Revision/Approving/UserFlowApproving";
import { DocumentRevisionResponsibleUserFlowRowEntity } from "entities/Document/Document/Revision/Approving/UserFlowApproving/Row";
import { DocumentRevisionResponsibleUserFlowRowUserEntity } from "entities/Document/Document/Revision/Approving/UserFlowApproving/Row/User";
import { DocumentRevisionResponsibleUserFlowRowUserFileEntity } from "entities/Document/Document/Revision/Approving/UserFlowApproving/Row/User/File";
import { DocumentRevisionResponsibleUserFlowReviewerEntity } from "entities/Document/Document/Revision/Approving/UserFlowApproving/Reviewer";

import { DocumentRevisionsController } from "./controllers";
import { DocumentRevisionFavouritesController } from "./controllers/favourites";

import { InitElasticDocumentRevisionsService } from "./services/init";
import { DocumentRevisionAutoResolveByCommentsListenerService } from "./services/background/auto-resolve-by-comments-listener";
import { DocumentRevisionAutoUpdateUserFlowListenerService } from "./services/background/auto-update-user-flow-listener";
import { AddDocumentRevisionFavouritesService } from "./services/favourites/add";
import { GetDocumentRevisionIsFavouritesService } from "./services/favourites/get-is-favourite";
import { GetDocumentRevisionFavouritesListService } from "./services/favourites/get-list";
import { RemoveDocumentRevisionFavouritesService } from "./services/favourites/remove";
import { CreateDocumentRevisionFilesElasticService } from "./services/files/create-elastic";
import { DeleteDocumentRevisionFilesService } from "./services/files/delete";
import { UploadDocumentRevisionFilesService } from "./services/files/upload";
import { CreateDocumentRevisionResponsibleUserService } from "./services/responsible-user/user/create";
import { DeleteDocumentRevisionResponsibleUserService } from "./services/responsible-user/user/delete";
import { EditDocumentRevisionResponsibleUserService } from "./services/responsible-user/user/edit";
import { DocumentRevisionResponsibleUserFlowClearNotifiedService } from "./services/responsible-user/userFlow/clear-notified";
import { CreateDocumentRevisionResponsibleUserFlowService } from "./services/responsible-user/userFlow/create";
import { DeleteDocumentRevisionResponsibleUserFlowService } from "./services/responsible-user/userFlow/delete";
import { EditDocumentRevisionResponsibleUserFlowService } from "./services/responsible-user/userFlow/edit";
import { CreateDocumentRevisionsService } from "./services/revisions/create";
import { CreateDocumentRevisionsElasticService } from "./services/revisions/create-elastic";
import { DeleteDocumentRevisionsService } from "./services/revisions/delete";
import { EditDocumentRevisionsService } from "./services/revisions/edit";
import { GetDocumentRevisionService } from "./services/revisions/get";
import { GetDocumentRevisionsListService } from "./services/revisions/get-list";
import { MoveDocumentRevisionsService } from "./services/revisions/move";
import { ActiveDocumentRevisionStatusesService } from "./services/statuses/active";
import { ApproveDocumentRevisionStatusesService } from "./services/statuses/approve";
import { ArchiveDocumentRevisionStatusesService } from "./services/statuses/archive";
import { CancelReviewDocumentRevisionStatusesService } from "./services/statuses/cancel-review";
import { EditDocumentRevisionStatusesService } from "./services/statuses/edit-status";
import { GetDocumentRevisionForChangeStatusService } from "./services/statuses/get-for-change";
import { GetDocumentRevisionInitialStatusService } from "./services/statuses/get-initial-status";
import { DocumentRevisionProlongApprovingDeadlineService } from "./services/statuses/prolong-approving-deadline";
import { RequestReviewDocumentRevisionStatusesService } from "./services/statuses/request-review";
import { ResetToInitialDocumentRevisionStatusesService } from "./services/statuses/reset-to-initial";
import { RestoreDocumentRevisionStatusesService } from "./services/statuses/restore";
import { ReturnDocumentRevisionStatusesService } from "./services/statuses/return";
import { RevokeDocumentRevisionStatusesService } from "./services/statuses/revoke";
import { CloneDocumentRevisionUserFlowService } from "./services/userFlow/clone";
import { CreateDocumentRevisionUserFlowService } from "./services/userFlow/create";
import { DeleteDocumentRevisionUserFlowService } from "./services/userFlow/delete";
import { DocumentRevisionEventListenerService } from "./services/background/event-listener";
import { DocumentRevisionApprovingDeadlineEmitterService } from "./services/background/approving-deadline/emitter";
import { DocumentRevisionApprovingDeadlineEventListenerService } from "./services/background/approving-deadline/event-listener";
import { DocumentRevisionUserFlowDeadlineEmitterService } from "./services/background/user-flow/emitter";
import { DocumentRevisionUserFlowDeadlineEventListenerService } from "./services/background/user-flow/event-listener";

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      DocumentRevisionEntity,
      DocumentRevisionReturnCountsEntity,
      DocumentRevisionFileEntity,
      DocumentRevisionResponsibleUserEntity,
      DocumentGroupEntity,
      DocumentRevisionFavouriteEntity,
      DocumentRevisionResponsibleUserFlowEntity,
      DocumentRevisionResponsibleUserFlowRowEntity,
      DocumentRevisionResponsibleUserFlowRowUserEntity,
      DocumentRevisionResponsibleUserFlowRowUserFileEntity,
      DocumentRevisionResponsibleUserFlowReviewerEntity,
    ]),
  ],
  controllers: [DocumentRevisionFavouritesController, DocumentRevisionsController],
  providers: [
    AddDocumentRevisionFavouritesService,
    GetDocumentRevisionIsFavouritesService,
    GetDocumentRevisionFavouritesListService,
    RemoveDocumentRevisionFavouritesService,
    CreateDocumentRevisionFilesElasticService,
    DeleteDocumentRevisionFilesService,
    UploadDocumentRevisionFilesService,
    CreateDocumentRevisionResponsibleUserService,
    DeleteDocumentRevisionResponsibleUserService,
    EditDocumentRevisionResponsibleUserService,
    DocumentRevisionResponsibleUserFlowClearNotifiedService,
    CreateDocumentRevisionResponsibleUserFlowService,
    DeleteDocumentRevisionResponsibleUserFlowService,
    EditDocumentRevisionResponsibleUserFlowService,
    CreateDocumentRevisionsService,
    CreateDocumentRevisionsElasticService,
    DeleteDocumentRevisionsService,
    EditDocumentRevisionsService,
    GetDocumentRevisionService,
    GetDocumentRevisionsListService,
    MoveDocumentRevisionsService,
    ActiveDocumentRevisionStatusesService,
    ApproveDocumentRevisionStatusesService,
    ArchiveDocumentRevisionStatusesService,
    CancelReviewDocumentRevisionStatusesService,
    EditDocumentRevisionStatusesService,
    GetDocumentRevisionForChangeStatusService,
    GetDocumentRevisionInitialStatusService,
    DocumentRevisionProlongApprovingDeadlineService,
    RequestReviewDocumentRevisionStatusesService,
    ResetToInitialDocumentRevisionStatusesService,
    RestoreDocumentRevisionStatusesService,
    ReturnDocumentRevisionStatusesService,
    RevokeDocumentRevisionStatusesService,
    CloneDocumentRevisionUserFlowService,
    CreateDocumentRevisionUserFlowService,
    DeleteDocumentRevisionUserFlowService,
    DocumentRevisionAutoResolveByCommentsListenerService,
    DocumentRevisionAutoUpdateUserFlowListenerService,
    InitElasticDocumentRevisionsService,
    DocumentRevisionEventListenerService,
    DocumentRevisionApprovingDeadlineEmitterService,
    DocumentRevisionApprovingDeadlineEventListenerService,
    DocumentRevisionUserFlowDeadlineEmitterService,
    DocumentRevisionUserFlowDeadlineEventListenerService,
  ],
  exports: [
    AddDocumentRevisionFavouritesService,
    GetDocumentRevisionIsFavouritesService,
    GetDocumentRevisionFavouritesListService,
    RemoveDocumentRevisionFavouritesService,
    CreateDocumentRevisionFilesElasticService,
    DeleteDocumentRevisionFilesService,
    UploadDocumentRevisionFilesService,
    CreateDocumentRevisionResponsibleUserService,
    DeleteDocumentRevisionResponsibleUserService,
    EditDocumentRevisionResponsibleUserService,
    DocumentRevisionResponsibleUserFlowClearNotifiedService,
    CreateDocumentRevisionResponsibleUserFlowService,
    DeleteDocumentRevisionResponsibleUserFlowService,
    EditDocumentRevisionResponsibleUserFlowService,
    CreateDocumentRevisionsService,
    CreateDocumentRevisionsElasticService,
    DeleteDocumentRevisionsService,
    EditDocumentRevisionsService,
    GetDocumentRevisionService,
    GetDocumentRevisionsListService,
    MoveDocumentRevisionsService,
    ActiveDocumentRevisionStatusesService,
    ApproveDocumentRevisionStatusesService,
    ArchiveDocumentRevisionStatusesService,
    CancelReviewDocumentRevisionStatusesService,
    EditDocumentRevisionStatusesService,
    GetDocumentRevisionForChangeStatusService,
    GetDocumentRevisionInitialStatusService,
    DocumentRevisionProlongApprovingDeadlineService,
    RequestReviewDocumentRevisionStatusesService,
    RestoreDocumentRevisionStatusesService,
    ReturnDocumentRevisionStatusesService,
    RevokeDocumentRevisionStatusesService,
    CloneDocumentRevisionUserFlowService,
    CreateDocumentRevisionUserFlowService,
    DeleteDocumentRevisionUserFlowService,
    InitElasticDocumentRevisionsService,
  ],
})
export class DocumentRevisionsModule {
  constructor(elasticDocumentRevisionsService: InitElasticDocumentRevisionsService) {
    elasticDocumentRevisionsService.appBootstrap();
  }
}

export * from "./services/init";

export * from "./events/RevisionCreated";
export * from "./events/RevisionDeleted";
export * from "./events/RevisionUpdated";

export * from "./services/favourites/add";
export * from "./services/favourites/get-is-favourite";
export * from "./services/favourites/get-list";
export * from "./services/favourites/remove";

export * from "./services/files/create-elastic";
export * from "./services/files/delete";
export * from "./services/files/upload";

export * from "./services/responsible-user/user/create";
export * from "./services/responsible-user/user/delete";
export * from "./services/responsible-user/user/edit";

export * from "./services/responsible-user/userFlow/create";
export * from "./services/responsible-user/userFlow/delete";
export * from "./services/responsible-user/userFlow/edit";

export * from "./services/revisions/create";
export * from "./services/revisions/create-elastic";
export * from "./services/revisions/delete";
export * from "./services/revisions/edit";
export * from "./services/revisions/get";
export * from "./services/revisions/get-list";
export * from "./services/revisions/move";

export * from "./services/statuses/active";
export * from "./services/statuses/approve";
export * from "./services/statuses/archive";
export * from "./services/statuses/cancel-review";
export * from "./services/statuses/edit-status";
export * from "./services/statuses/get-for-change";
export * from "./services/statuses/get-initial-status";
export * from "./services/statuses/prolong-approving-deadline";
export * from "./services/statuses/request-review";
export * from "./services/statuses/restore";
export * from "./services/statuses/return";
export * from "./services/statuses/revoke";

export * from "./services/userFlow/clone";
export * from "./services/userFlow/create";
export * from "./services/userFlow/delete";

export * from "./types";
