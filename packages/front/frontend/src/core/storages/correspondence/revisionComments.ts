import { entityGetter, METHODS } from "@app/kit";
import { Inject, Service } from "typedi";
import { action, observable } from "mobx";
import { InternalRequestManager, parseServerError, Storage } from "@app/front-kit";

import {
  arrayOfCorrespondenceRevisionCommentEntitiesDecoder,
  CorrespondenceRevisionCommentEntity,
} from "core/entities/correspondenceRevision/revisionComment";
import { IdEntity } from "core/entities/id";
import { FileEntity } from "core/entities/file";

import { updateFileArrayRequest, updateFileRequest } from "core/storages/_common/updateFile";

import { EditCorrespondenceRevisionCommentEntity } from "./entities/comment/EditCorrespondenceRevisionComment";
import { CorrespondenceRevisionsStorage } from "./revisions";
import { prepareTextEditorHtmlToSave } from "../_common/prepareTextEditorHtmlToSave";

@Service()
export class CorrespondenceRevisionCommentsStorage extends Storage {
  static token = "CorrespondenceRevisionCommentsStorage";

  constructor() {
    super();
    this.initStorage(CorrespondenceRevisionCommentsStorage.token);
  }

  @Inject() private requestManager!: InternalRequestManager;
  @Inject() private revisionsStorage!: CorrespondenceRevisionsStorage;

  @observable comments: CorrespondenceRevisionCommentEntity[] = [];

  @action loadComments = async () => {
    try {
      const { array } = await this.requestManager.createRequest({
        url: "/correspondence-revision/{revisionId}/comments",
        method: METHODS.GET,
        responseDataFieldPath: ["items"],
        serverDataEntityDecoder: arrayOfCorrespondenceRevisionCommentEntitiesDecoder,
      })({ urlParams: { revisionId: this.revisionsStorage.revisionDetail!.id } });
      this.comments = array;
      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action createComment = async (entity: EditCorrespondenceRevisionCommentEntity) => {
    try {
      const { id: commentId } = await this.requestManager.createRequest({
        url: "/correspondence-revision/{revisionId}/comments",
        method: METHODS.POST,
        serverDataEntityDecoder: IdEntity,
      })({ urlParams: { revisionId: entity.apiCreateReady.revisionId }, body: entity.apiCreateReady.body.excludeText });

      const uploadResults = await Promise.all(
        entity.attachments.map((attachment) =>
          updateFileRequest(null, attachment, {
            uploadFile: (body) =>
              this.requestManager.createRequest({
                url: "/correspondence-revision/comments/{commentId}/upload",
                method: METHODS.POST,
                serverDataEntityDecoder: FileEntity,
              })({
                urlParams: { commentId },
                body,
                progressReceiver: attachment.setProgress,
              }),
          }),
        ),
      );

      const comment = await this.requestManager.createRequest({
        url: "/correspondence-revision/comments/{commentId}",
        method: METHODS.PATCH,
        serverDataEntityDecoder: CorrespondenceRevisionCommentEntity,
      })({
        urlParams: { commentId },
        body: {
          isPartOfTransaction: true,
          text: prepareTextEditorHtmlToSave(entity.apiUpdateReady.body.onlyText.text, { uploadResults }),
        },
      });

      this.comments.push(comment);

      return { success: true, commentId, uploadResults } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action updateComment = async (entity: EditCorrespondenceRevisionCommentEntity) => {
    const currentComment = entityGetter(this.comments, entity.apiUpdateReady.commentId, "id");
    if (!currentComment) return { success: false, error: false } as const;

    try {
      const { uploadResults, deleteResults } = await updateFileArrayRequest(
        currentComment.entity.files,
        entity.attachments,
        {
          uploadFile: (body, attachment) =>
            this.requestManager
              .createRequest({
                url: "/correspondence-revision/comments/{commentId}/upload",
                method: METHODS.POST,
                serverDataEntityDecoder: FileEntity,
              })({
                urlParams: { commentId: entity.apiUpdateReady.commentId },
                body,
                progressReceiver: attachment.setProgress,
              })
              .finally(() => attachment.setProgress(undefined)),
          deleteFile: (fileId) =>
            this.requestManager.createRequest({
              url: "/correspondence-revision/comments/delete-file/{fileId}",
              method: METHODS.DELETE,
            })({
              urlParams: { fileId },
            }),
        },
      );

      await this.requestManager.createRequest({
        url: "/correspondence-revision/comments/{commentId}",
        method: METHODS.PATCH,
      })({
        urlParams: { commentId: entity.apiUpdateReady.commentId },
        body: {
          text: prepareTextEditorHtmlToSave(entity.apiUpdateReady.body.onlyText.text, { uploadResults, deleteResults }),
        },
      });

      return { success: true, uploadResults, deleteResults } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action deleteComment = async (commentId: string) => {
    try {
      await this.requestManager.createRequest({
        url: "/correspondence-revision/comments/{commentId}",
        method: METHODS.DELETE,
      })({ urlParams: { commentId } });
      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };
}
