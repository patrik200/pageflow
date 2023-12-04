import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req } from "@nestjs/common";
import { UserRole } from "@app/shared-enums";
import { ControllerResponse, ServiceError, StorageFileDTO } from "@app/back-kit";

import { ResponseIdDTO } from "constants/ResponseId";

import { getCurrentUser, withUserAuthorized } from "modules/auth";

import { BaseExpressRequest } from "types/express";

import { DeleteDocumentRevisionFilesService } from "../services/files/delete";
import { UploadDocumentRevisionFilesService } from "../services/files/upload";
import { CreateDocumentRevisionsService } from "../services/revisions/create";
import { DeleteDocumentRevisionsService } from "../services/revisions/delete";
import { EditDocumentRevisionsService } from "../services/revisions/edit";
import { GetDocumentRevisionService } from "../services/revisions/get";
import { GetDocumentRevisionsListService } from "../services/revisions/get-list";
import { ActiveDocumentRevisionStatusesService } from "../services/statuses/active";
import { ApproveDocumentRevisionStatusesService } from "../services/statuses/approve";
import { ArchiveDocumentRevisionStatusesService } from "../services/statuses/archive";
import { CancelReviewDocumentRevisionStatusesService } from "../services/statuses/cancel-review";
import { RequestReviewDocumentRevisionStatusesService } from "../services/statuses/request-review";
import { RestoreDocumentRevisionStatusesService } from "../services/statuses/restore";
import { ReturnDocumentRevisionStatusesService } from "../services/statuses/return";
import { RevokeDocumentRevisionStatusesService } from "../services/statuses/revoke";
import { DocumentRevisionProlongApprovingDeadlineService } from "../services/statuses/prolong-approving-deadline";

import {
  RequestDocumentRevisionDTO,
  ResponseDocumentRevisionDetailDTO,
  ResponseDocumentRevisionsListDTO,
} from "../dto/get/DocumentRevision";
import { RequestCreateDocumentRevisionDTO } from "../dto/edit/CreateDocumentRevision";
import { RequestUpdateDocumentRevisionDTO } from "../dto/edit/UpdateDocumentRevision";
import { RequestReturnDocumentRevisionDTO } from "../dto/edit/ReturnDocumentRevision";
import { RequestApproveDocumentRevisionDTO } from "../dto/edit/ApproveDocumentRevision";
import { RequestProlongApprovingDeadlineDocumentRevisionDTO } from "../dto/edit/ProlongApprovingDeadlineDocumentRevision";

@Controller("document-revisions")
export class DocumentRevisionsController {
  constructor(
    private getDocumentRevisionService: GetDocumentRevisionService,
    private getDocumentRevisionsListService: GetDocumentRevisionsListService,
    private createDocumentRevisionsService: CreateDocumentRevisionsService,
    private editDocumentRevisionsService: EditDocumentRevisionsService,
    private deleteDocumentRevisionsService: DeleteDocumentRevisionsService,
    private uploadDocumentRevisionFilesService: UploadDocumentRevisionFilesService,
    private deleteDocumentRevisionFilesService: DeleteDocumentRevisionFilesService,
    private requestReviewDocumentRevisionStatusesService: RequestReviewDocumentRevisionStatusesService,
    private cancelReviewDocumentRevisionStatusesService: CancelReviewDocumentRevisionStatusesService,
    private restoreDocumentRevisionStatusesService: RestoreDocumentRevisionStatusesService,
    private returnDocumentRevisionStatusesService: ReturnDocumentRevisionStatusesService,
    private approveDocumentRevisionStatusesService: ApproveDocumentRevisionStatusesService,
    private revokeDocumentRevisionStatusesService: RevokeDocumentRevisionStatusesService,
    private archiveDocumentRevisionStatusesService: ArchiveDocumentRevisionStatusesService,
    private activeDocumentRevisionStatusesService: ActiveDocumentRevisionStatusesService,
    private prolongApprovingDeadlineService: DocumentRevisionProlongApprovingDeadlineService,
  ) {}

  @Get("document/:documentId/revisions")
  @withUserAuthorized([UserRole.USER])
  async getRevisions(@Param("documentId") documentId: string, @Query() query: RequestDocumentRevisionDTO) {
    const revisions = await this.getDocumentRevisionsListService.getRevisionsListOrFail(documentId, {
      loadFavourites: true,
      showArchived: query.showArchived,
      sorting: query.sorting,
      loadAuthorAvatar: true,
    });

    return new ControllerResponse(ResponseDocumentRevisionsListDTO, { list: revisions });
  }

  @Get(":revisionId")
  @withUserAuthorized([UserRole.USER])
  async getRevisionDetail(@Param("revisionId") revisionId: string) {
    const revision = await this.getDocumentRevisionService.getRevisionOrFail(revisionId, {
      loadReturnsCount: true,
      calculateParentGroupPath: true,
      loadFavourites: true,
      loadAuthorAvatar: true,
      loadFiles: true,
      loadDocumentAuthor: true,
      loadDocumentResponsibleUser: true,
      loadDocumentRootGroup: true,
      loadDocumentRootGroupParentProject: true,
      loadResponsibleUserFlowApprovingUserAvatar: true,
      loadResponsibleUserFlowApprovingReviewerUserAvatar: true,
      loadResponsibleUserFlowApprovingRowsUsersUserAvatar: true,
      loadResponsibleUserFlowApprovingRowsUsersFiles: true,
    });

    return new ControllerResponse(ResponseDocumentRevisionDetailDTO, revision);
  }

  @Post("document/:documentId/revisions")
  @withUserAuthorized([UserRole.USER])
  async createRevision(@Param("documentId") documentId: string, @Body() body: RequestCreateDocumentRevisionDTO) {
    const revisionId = await this.createDocumentRevisionsService.createRevisionOrFail(documentId, {
      authorId: getCurrentUser().userId,
      number: body.number,
      responsibleUserId: body.responsibleUserId,
      responsibleUserFlowId: body.responsibleUserFlowId,
      approvingDeadline: body.approvingDeadline,
      canProlongApprovingDeadline: body.canProlongApprovingDeadline,
    });

    return new ControllerResponse(ResponseIdDTO, { id: revisionId });
  }

  @Patch(":revisionId")
  @withUserAuthorized([UserRole.USER])
  async updateRevision(@Param("revisionId") revisionId: string, @Body() body: RequestUpdateDocumentRevisionDTO) {
    await this.editDocumentRevisionsService.updateRevisionOrFail(revisionId, {
      number: body.number,
      responsibleUserId: body.responsibleUserId,
      responsibleUserFlowId: body.responsibleUserFlowId,
      approvingDeadline: body.approvingDeadline,
      canProlongApprovingDeadline: body.canProlongApprovingDeadline,
    });
  }

  @Delete(":revisionId")
  @withUserAuthorized([UserRole.USER])
  async deleteRevision(@Param("revisionId") revisionId: string) {
    await this.deleteDocumentRevisionsService.deleteRevisionOrFail(revisionId);
  }

  @Post(":revisionId/upload")
  @withUserAuthorized([UserRole.USER])
  async uploadRevisionFile(@Param("revisionId") revisionId: string, @Req() req: BaseExpressRequest) {
    if (!req.files.file) throw new ServiceError("file", "Файл не отправлен");
    const { file } = await this.uploadDocumentRevisionFilesService.uploadFileOrFail(revisionId, req.files.file);
    return new ControllerResponse(StorageFileDTO, file);
  }

  @Delete(":revisionId/delete-file/:fileId")
  @withUserAuthorized([UserRole.USER])
  async deleteRevisionFile(@Param("revisionId") revisionId: string, @Param("fileId") fileId: string) {
    await this.deleteDocumentRevisionFilesService.deleteFileOrFail(revisionId, fileId);
  }

  @Post(":revisionId/request-review")
  @withUserAuthorized([UserRole.USER])
  async requestRevisionReview(@Param("revisionId") revisionId: string) {
    await this.requestReviewDocumentRevisionStatusesService.requestRevisionReviewOrFail(revisionId);
  }

  @Post(":revisionId/cancel-review")
  @withUserAuthorized([UserRole.USER])
  async cancelRevisionReview(@Param("revisionId") revisionId: string) {
    await this.cancelReviewDocumentRevisionStatusesService.cancelRevisionReviewOrFail(revisionId);
  }

  @Post(":revisionId/restore-from-revoked")
  @withUserAuthorized([UserRole.USER])
  async restoreRevision(@Param("revisionId") revisionId: string) {
    await this.restoreDocumentRevisionStatusesService.restoreRevisionOrFail(revisionId);
  }

  @Post(":revisionId/return")
  @withUserAuthorized([UserRole.USER])
  async returnRevision(@Param("revisionId") revisionId: string, @Body() body: RequestReturnDocumentRevisionDTO) {
    await this.returnDocumentRevisionStatusesService.returnRevisionOrFail(revisionId, {
      comment: body.message,
      returnCodeKey: body.returnCodeKey,
    });
  }

  @Post(":revisionId/approve")
  @withUserAuthorized([UserRole.USER])
  async approveRevision(@Param("revisionId") revisionId: string, @Body() body: RequestApproveDocumentRevisionDTO) {
    await this.approveDocumentRevisionStatusesService.approveRevisionOrFail(revisionId, {
      userFlowRowIndex: body.responsibleUserFlowRowIndex,
      userFlowRowUserIndex: body.responsibleUserFlowRowUserIndex,
      result: body.result,
      comment: body.comment,
    });
  }

  @Post("approve/add-attachment/:rowUserId")
  @withUserAuthorized([UserRole.USER])
  async uploadResponsibleUserFlowRowUserAttachment(
    @Param("rowUserId") rowUserId: string,
    @Req() req: BaseExpressRequest,
  ) {
    if (!req.files.file) throw new ServiceError("file", "Файл не отправлен");
    const { file } = await this.uploadDocumentRevisionFilesService.uploadResponsibleUserFlowRowUserAttachmentOrFail(
      rowUserId,
      req.files.file,
    );
    return new ControllerResponse(StorageFileDTO, file);
  }

  @Post(":revisionId/revoke")
  @withUserAuthorized([UserRole.USER])
  async revokeRevision(@Param("revisionId") revisionId: string) {
    await this.revokeDocumentRevisionStatusesService.revokeRevisionOrFail(revisionId);
  }

  @Post(":revisionId/archive")
  @withUserAuthorized([UserRole.USER])
  async archiveRevision(@Param("revisionId") revisionId: string) {
    await this.archiveDocumentRevisionStatusesService.archiveRevisionOrFail(revisionId);
  }

  @Post(":revisionId/active")
  @withUserAuthorized([UserRole.USER])
  async activeRevision(@Param("revisionId") revisionId: string) {
    await this.activeDocumentRevisionStatusesService.activeRevisionOrFail(revisionId);
  }

  @Post(":revisionId/prolong-approving-deadline")
  @withUserAuthorized([UserRole.USER])
  async prolongApprovingDeadline(
    @Param("revisionId") revisionId: string,
    @Body() body: RequestProlongApprovingDeadlineDocumentRevisionDTO,
  ) {
    await this.prolongApprovingDeadlineService.prolongApprovingDeadlineOrFail(revisionId, {
      approvingDeadline: body.approvingDeadline,
    });
  }
}
