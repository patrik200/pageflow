import { entityGetter, METHODS } from "@app/kit";
import { Inject, Service } from "typedi";
import { action, observable } from "mobx";
import { InternalRequestManager, parseServerError, Storage } from "@app/front-kit";

import { IdEntity } from "core/entities/id";
import { FileEntity } from "core/entities/file";
import {
  arrayOfDocumentRevisionEntitiesDecoder,
  DocumentRevisionEntity,
} from "core/entities/documentRevision/revision";
import { DocumentRevisionDetailEntity } from "core/entities/documentRevision/revisionDetail";
import { arrayOfChangeFeedEventEntities } from "core/entities/change-feed";

import { IntlDateStorage } from "core/storages/intl-date";
import { updateFileArrayRequest, updateFileRequest } from "core/storages/_common/updateFile";

import { EditDocumentRevisionEntity } from "./entities/revision/EditDocumentRevision";
import { DocumentRevisionFilterEntity } from "./entities/revision/DocumentRevisionFilter";
import { MoveToReturnStatusEntity } from "./entities/revision/MoveToReturnStatusEntity";
import { ApproveUserFlowRowUserEntity } from "./entities/revision/ApproveUserFlowRowUser";
import { ProlongApprovingDateEntity } from "./entities/revision/ProlongApprovingDateEntity";
import { MoveToApprovedStatusEntity } from "./entities/revision/MoveToApprovedStatusEntity";
import { MoveToReviewerApprovedStatusEntity } from "./entities/revision/MoveToReviewerApprovedStatusEntity";

@Service()
export class DocumentRevisionsStorage extends Storage {
  static token = "DocumentRevisionsStorage";

  constructor() {
    super();
    this.initStorage(DocumentRevisionsStorage.token);
  }

  @Inject() private requestManager!: InternalRequestManager;
  @Inject() private intlDateStorage!: IntlDateStorage;

  @observable revisions: DocumentRevisionEntity[] = [];
  @observable revisionDetail: DocumentRevisionDetailEntity | null = null;

  @action loadRevisions = async (entity: DocumentRevisionFilterEntity) => {
    try {
      const { array } = await this.requestManager.createRequest({
        url: "/document-revisions/document/{documentId}/revisions",
        method: METHODS.GET,
        responseDataFieldPath: ["list"],
        serverDataEntityDecoder: arrayOfDocumentRevisionEntitiesDecoder,
      })({ urlParams: entity.apiReady.url, body: entity.apiReady.body });
      const intlDate = this.intlDateStorage.getIntlDate();
      array.forEach((revision) => revision.configure(intlDate));
      this.revisions = array;
      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action loadRevisionDetail = async (revisionId: string) => {
    try {
      const [revision, { array: changeFeedEvents }] = await Promise.all([
        this.requestManager.createRequest({
          url: "/document-revisions/{revisionId}",
          method: METHODS.GET,
          serverDataEntityDecoder: DocumentRevisionDetailEntity,
        })({ urlParams: { revisionId } }),
        this.requestManager.createRequest({
          url: "/change-feed/document_revision/{revisionId}",
          method: METHODS.GET,
          serverDataEntityDecoder: arrayOfChangeFeedEventEntities,
          responseDataFieldPath: ["list"],
        })({ urlParams: { revisionId } }),
      ]);
      revision.changeFeedEvents = changeFeedEvents;
      revision.configure(this.intlDateStorage.getIntlDate());
      this.revisionDetail = revision;
      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action reloadRevisionDetail = () => this.loadRevisionDetail(this.revisionDetail!.id);

  @action createRevision = async (entity: EditDocumentRevisionEntity) => {
    try {
      const { id: revisionId } = await this.requestManager.createRequest({
        url: "/document-revisions/document/{documentId}/revisions",
        method: METHODS.POST,
        serverDataEntityDecoder: IdEntity,
      })({ urlParams: { documentId: entity.apiCreateReady.documentId }, body: entity.apiCreateReady.body });

      const uploadResults = await Promise.all(
        entity.attachments.map((attachment) =>
          updateFileRequest(null, attachment, {
            uploadFile: (body) =>
              this.requestManager.createRequest({
                url: "/document-revisions/{revisionId}/upload",
                method: METHODS.POST,
                serverDataEntityDecoder: FileEntity,
              })({ urlParams: { revisionId }, body, progressReceiver: attachment.setProgress }),
            deleteFile: () => null!,
          }),
        ),
      );

      return { success: true, revisionId, uploadResults } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action updateRevision = async (entity: EditDocumentRevisionEntity) => {
    try {
      await this.requestManager.createRequest({
        url: "/document-revisions/{revisionId}",
        method: METHODS.PATCH,
      })({ urlParams: { revisionId: entity.apiUpdateReady.revisionId }, body: entity.apiUpdateReady.body });

      const { uploadResults, deleteResults } = await updateFileArrayRequest(
        this.revisionDetail!.files,
        entity.attachments,
        {
          uploadFile: (body, attachment) =>
            this.requestManager
              .createRequest({
                url: "/document-revisions/{revisionId}/upload",
                method: METHODS.POST,
                serverDataEntityDecoder: FileEntity,
              })({
                urlParams: { revisionId: entity.apiUpdateReady.revisionId },
                body,
                progressReceiver: attachment.setProgress,
              })
              .finally(() => attachment.setProgress(undefined)),
          deleteFile: (fileId) =>
            this.requestManager.createRequest({
              url: "/document-revisions/{revisionId}/delete-file/{fileId}",
              method: METHODS.DELETE,
            })({
              urlParams: { revisionId: entity.apiUpdateReady.revisionId, fileId },
            }),
        },
      );

      return { success: true, uploadResults, deleteResults } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action setFavourite = async (revisionId: string, favourite: boolean) => {
    try {
      await this.requestManager.createRequest({
        url: "/document-revisions/favourites/{revisionId}",
        method: favourite ? METHODS.POST : METHODS.DELETE,
      })({ urlParams: { revisionId } });
      const revisionInList = entityGetter(this.revisions, revisionId, "id");
      if (revisionInList) revisionInList.entity.setFavourite(favourite);
      if (this.revisionDetail?.id === revisionId) this.revisionDetail.setFavourite(favourite);
      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action archive = async () => {
    try {
      await this.requestManager.createRequest({
        url: "/document-revisions/{revisionId}/archive",
        method: METHODS.POST,
      })({ urlParams: { revisionId: this.revisionDetail!.id } });
      await this.reloadRevisionDetail();
      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action active = async () => {
    try {
      await this.requestManager.createRequest({
        url: "/document-revisions/{revisionId}/active",
        method: METHODS.POST,
      })({ urlParams: { revisionId: this.revisionDetail!.id } });
      await this.reloadRevisionDetail();
      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action delete = async (revisionId: string) => {
    try {
      await this.requestManager.createRequest({
        url: "/document-revisions/{revisionId}",
        method: METHODS.DELETE,
      })({ urlParams: { revisionId } });
      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action private moveToStatus = async (urlStatus: string, body?: Object) => {
    try {
      await this.requestManager.createRequest({
        url: `/document-revisions/{revisionId}/{urlStatus}`,
        method: METHODS.POST,
      })({ urlParams: { revisionId: this.revisionDetail!.id, urlStatus }, body });
      await this.reloadRevisionDetail();
      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action moveToApprovedStatus = async (
    body:
      | {
          moveToApprovedStatusEntity: MoveToApprovedStatusEntity;
        }
      | {
          responsibleUserFlowRowIndex: number;
          responsibleUserFlowRowUserIndex: number;
          approveUserFlowRowUserEntity: ApproveUserFlowRowUserEntity;
        }
      | {
          responsibleUserFlowReviewer: true;
          moveToReviewerApprovedStatusEntity: MoveToReviewerApprovedStatusEntity;
        },
  ) => {
    if ("responsibleUserFlowReviewer" in body) {
      try {
        return await this.moveToStatus("approve", {
          responsibleUserFlowRowUserIndex: -1,
          responsibleUserFlowRowIndex: -1,
          comment: body.moveToReviewerApprovedStatusEntity.apiReady.comment,
        });
      } catch (error) {
        return { success: false, error: parseServerError(error) } as const;
      }
    }

    if ("approveUserFlowRowUserEntity" in body) {
      const { approveUserFlowRowUserEntity, responsibleUserFlowRowUserIndex, responsibleUserFlowRowIndex } = body;
      try {
        await updateFileArrayRequest([], approveUserFlowRowUserEntity.apiReadyBody.attachments, {
          uploadFile: (formData) =>
            this.requestManager.createRequest({
              url: "/document-revisions/approve/add-attachment/{id}",
              method: METHODS.POST,
              serverDataEntityDecoder: FileEntity,
            })({ urlParams: { id: approveUserFlowRowUserEntity.apiReadyParam.rowUserId }, body: formData }),
        });

        return await this.moveToStatus("approve", {
          responsibleUserFlowRowUserIndex,
          responsibleUserFlowRowIndex,
          result: body.approveUserFlowRowUserEntity.apiReadyBody.result,
        });
      } catch (error) {
        return { success: false, error: parseServerError(error) } as const;
      }
    }

    if ("moveToApprovedStatusEntity" in body) {
      try {
        return await this.moveToStatus("approve", {
          comment: body.moveToApprovedStatusEntity.apiReady.comment,
        });
      } catch (error) {
        return { success: false, error: parseServerError(error) } as const;
      }
    }

    throw new Error("unknown state");
  };

  @action moveToInitialStatusForCancelReview = () => this.moveToStatus("cancel-review");

  @action moveToInitialStatusForRestoreFromRevoked = () => this.moveToStatus("restore-from-revoked");

  @action moveToReturnStatus = (entity: MoveToReturnStatusEntity) => this.moveToStatus("return", entity.apiReady);

  @action moveToReviewStatus = () => this.moveToStatus("request-review");

  @action moveToRevokedStatus = () => this.moveToStatus("revoke");

  @action prolongApprovingDate = async (entity: ProlongApprovingDateEntity) => {
    try {
      await this.requestManager.createRequest({
        url: `/document-revisions/{revisionId}/prolong-approving-deadline`,
        method: METHODS.POST,
      })({ urlParams: { revisionId: entity.revisionId }, body: entity.apiReady });
      await this.reloadRevisionDetail();
      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };
}
