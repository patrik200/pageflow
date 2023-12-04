import { entityGetter, METHODS } from "@app/kit";
import { Inject, Service } from "typedi";
import { action, observable } from "mobx";
import { InternalRequestManager, parseServerError, Storage } from "@app/front-kit";

import {
  arrayOfDocumentRevisionCommentEntitiesDecoder,
  DocumentRevisionCommentEntity,
} from "core/entities/documentRevision/revisionComment";
import { IdEntity } from "core/entities/id";
import { FileEntity } from "core/entities/file";
import {
  arrayOfDocumentRevisionCommentDiscussionEntitiesDecoder,
  DocumentRevisionCommentDiscussionEntity,
} from "core/entities/documentRevision/revisionCommentDiscussion";
import { CommentsFilterEntity } from "core/storages/document/entities/comment/CommentsFilter";

import { updateFileArrayRequest, updateFileRequest } from "core/storages/_common/updateFile";

import { EditDocumentRevisionCommentEntity } from "./entities/comment/EditDocumentRevisionComment";
import { DocumentRevisionsStorage } from "./revisions";
import { EditDocumentRevisionCommentDiscussionEntity } from "./entities/comment/EditDocumentRevisionCommentDiscussion";
import { prepareTextEditorHtmlToSave } from "../_common/prepareTextEditorHtmlToSave";

@Service()
export class DocumentRevisionCommentsStorage extends Storage {
  static token = "DocumentRevisionCommentsStorage";

  constructor() {
    super();
    this.initStorage(DocumentRevisionCommentsStorage.token);
  }

  @Inject() private requestManager!: InternalRequestManager;
  @Inject() private revisionsStorage!: DocumentRevisionsStorage;

  @observable comments: DocumentRevisionCommentEntity[] = [];

  @action loadComments = async (entity: CommentsFilterEntity) => {
    try {
      const { array } = await this.requestManager.createRequest({
        url: "/document-revision/{revisionId}/comments",
        method: METHODS.GET,
        responseDataFieldPath: ["items"],
        serverDataEntityDecoder: arrayOfDocumentRevisionCommentEntitiesDecoder,
      })({
        urlParams: { revisionId: this.revisionsStorage.revisionDetail!.id },
        body: { showUnresolved: entity.apiReady.showUnresolved },
      });
      this.comments = array;
      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action createComment = async (entity: EditDocumentRevisionCommentEntity) => {
    try {
      const { id: commentId } = await this.requestManager.createRequest({
        url: "/document-revision/{revisionId}/comments",
        method: METHODS.POST,
        serverDataEntityDecoder: IdEntity,
      })({ urlParams: { revisionId: entity.apiCreateReady.revisionId }, body: entity.apiCreateReady.body.excludeText });

      const uploadResults = await Promise.all(
        entity.attachments.map((attachment) =>
          updateFileRequest(null, attachment, {
            uploadFile: (body) =>
              this.requestManager.createRequest({
                url: "/document-revision/comments/{commentId}/upload",
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
        url: "/document-revision/comments/{commentId}",
        method: METHODS.PATCH,
        serverDataEntityDecoder: DocumentRevisionCommentEntity,
      })({
        urlParams: { commentId },
        body: {
          isPartOfTransaction: true,
          text: prepareTextEditorHtmlToSave(entity.apiUpdateReady.body.onlyText.text, { uploadResults }),
        },
      });

      await this.revisionsStorage.reloadRevisionDetail();

      this.comments.push(comment);

      return { success: true, commentId, uploadResults } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action updateComment = async (entity: EditDocumentRevisionCommentEntity) => {
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
                url: "/document-revision/comments/{commentId}/upload",
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
              url: "/document-revision/comments/delete-file/{fileId}",
              method: METHODS.DELETE,
            })({
              urlParams: { fileId },
            }),
        },
      );

      await this.requestManager.createRequest({
        url: "/document-revision/comments/{commentId}",
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
        url: "/document-revision/comments/{commentId}",
        method: METHODS.DELETE,
      })({ urlParams: { commentId } });
      await this.revisionsStorage.reloadRevisionDetail();
      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action resolveComment = async (commentId: string) => {
    const comment = entityGetter(this.comments, commentId, "id");
    if (!comment) return { success: false, error: false } as const;

    try {
      await this.requestManager.createRequest({
        url: "/document-revision/comments/{commentId}/resolve",
        method: METHODS.POST,
      })({ urlParams: { commentId } });
      comment.entity.setResolved(true);
      comment.entity.setCanResolve(false);
      await this.revisionsStorage.reloadRevisionDetail();
      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  private async getDiscussionsList(commentId: string) {
    try {
      const { array } = await this.requestManager.createRequest({
        url: "/document-revision/comments/{commentId}/discussions",
        method: METHODS.GET,
        responseDataFieldPath: ["items"],
        serverDataEntityDecoder: arrayOfDocumentRevisionCommentDiscussionEntitiesDecoder,
      })({ urlParams: { commentId } });
      return array;
    } catch (error) {
      return [];
    }
  }

  private async getDiscussion(discussionId: string) {
    try {
      return await this.requestManager.createRequest({
        url: "/document-revision/discussions/{discussionId}",
        method: METHODS.GET,
        serverDataEntityDecoder: DocumentRevisionCommentDiscussionEntity,
      })({ urlParams: { discussionId } });
    } catch (error) {
      return null;
    }
  }

  @action loadDiscussionsForAllComments = async () => {
    try {
      await Promise.all(
        this.comments.map(async (comment) => {
          const discussions = await this.getDiscussionsList(comment.id);
          comment.setDiscussions(discussions);
        }),
      );
      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action createDiscussion = async (entity: EditDocumentRevisionCommentDiscussionEntity) => {
    const comment = entityGetter(this.comments, entity.apiCreateReady.url.commentId, "id");
    if (!comment) return { success: false, error: false } as const;

    try {
      const { id: discussionId } = await this.requestManager.createRequest({
        url: "/document-revision/comments/{commentId}/discussions",
        method: METHODS.POST,
        serverDataEntityDecoder: DocumentRevisionCommentDiscussionEntity,
      })({ urlParams: entity.apiCreateReady.url, body: entity.apiCreateReady.body.excludeText });

      const uploadResults = await Promise.all(
        entity.attachments.map((attachment) =>
          updateFileRequest(null, attachment, {
            uploadFile: (body) =>
              this.requestManager.createRequest({
                url: "/document-revision/discussions/{discussionId}/upload",
                method: METHODS.POST,
                serverDataEntityDecoder: FileEntity,
              })({ urlParams: { discussionId }, body, progressReceiver: attachment.setProgress }),
          }),
        ),
      );

      await this.requestManager.createRequest({
        url: "/document-revision/discussions/{discussionId}",
        method: METHODS.PATCH,
      })({
        urlParams: { discussionId },
        body: {
          isPartOfTransaction: true,
          text: prepareTextEditorHtmlToSave(entity.apiUpdateReady.body.onlyText.text, { uploadResults }),
        },
      });

      const newDiscussion = await this.getDiscussion(discussionId);
      if (!newDiscussion) return { success: false, error: false } as const;
      comment.entity.addDiscussion(newDiscussion);
      return { success: true, uploadResults } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action updateDiscussion = async (entity: EditDocumentRevisionCommentDiscussionEntity) => {
    const comment = entityGetter(this.comments, entity.apiCreateReady.url.commentId, "id");
    if (!comment) return { success: false, error: false } as const;
    const currentDiscussion = entityGetter(comment.entity.discussions, entity.id!, "id");
    if (!currentDiscussion) return { success: false, error: false } as const;

    try {
      const { uploadResults, deleteResults } = await updateFileArrayRequest(
        currentDiscussion.entity.files,
        entity.attachments,
        {
          uploadFile: (body, attachment) =>
            this.requestManager
              .createRequest({
                url: "/document-revision/discussions/{discussionId}/upload",
                method: METHODS.POST,
                serverDataEntityDecoder: FileEntity,
              })({
                urlParams: entity.apiUpdateReady.url,
                body,
                progressReceiver: attachment.setProgress,
              })
              .finally(() => attachment.setProgress(undefined)),
          deleteFile: (fileId) =>
            this.requestManager.createRequest({
              url: "/document-revision/discussions/delete-file/{fileId}",
              method: METHODS.POST,
            })({
              urlParams: { fileId },
            }),
        },
      );

      await this.requestManager.createRequest({
        url: "/document-revision/discussions/{discussionId}",
        method: METHODS.PATCH,
      })({
        urlParams: entity.apiUpdateReady.url,
        body: {
          text: prepareTextEditorHtmlToSave(entity.apiUpdateReady.body.onlyText.text, { uploadResults, deleteResults }),
        },
      });

      const updatedDiscussion = await this.getDiscussion(currentDiscussion.entity.id);
      if (!updatedDiscussion) return { success: false, error: false } as const;
      comment.entity.updateDiscussionByIndex(currentDiscussion.index, updatedDiscussion);
      return { success: true, uploadResults, deleteResults } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action deleteDiscussion = async (commentId: string, discussionId: string) => {
    const comment = entityGetter(this.comments, commentId, "id");
    if (!comment) return { success: false, error: false } as const;
    const currentDiscussion = entityGetter(comment.entity.discussions, discussionId, "id");
    if (!currentDiscussion) return { success: false, error: false } as const;

    try {
      await this.requestManager.createRequest({
        url: "/document-revision/discussions/{discussionId}",
        method: METHODS.DELETE,
      })({ urlParams: { discussionId } });

      comment.entity.deleteDiscussionByIndex(currentDiscussion.index);
      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };
}
