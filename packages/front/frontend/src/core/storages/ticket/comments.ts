import { entityGetter, METHODS } from "@app/kit";
import { Inject, Service } from "typedi";
import { action, observable } from "mobx";
import { InternalRequestManager, parseServerError, Storage } from "@app/front-kit";

import { IdEntity } from "core/entities/id";
import { FileEntity } from "core/entities/file";
import { arrayOfTicketCommentEntitiesDecoder, TicketCommentEntity } from "core/entities/ticket/ticketComment";

import { updateFileArrayRequest, updateFileRequest } from "core/storages/_common/updateFile";

import { EditTicketCommentEntity } from "./entities/EditTicketComment";
import { prepareTextEditorHtmlToSave } from "../_common/prepareTextEditorHtmlToSave";

import { TicketsStorage } from "./index";

@Service()
export class TicketCommentsStorage extends Storage {
  static token = "TicketCommentsStorage";

  constructor() {
    super();
    this.initStorage(TicketCommentsStorage.token);
  }

  @Inject() private requestManager!: InternalRequestManager;
  @Inject() private ticketsStorage!: TicketsStorage;

  @observable comments: TicketCommentEntity[] = [];

  @action loadComments = async () => {
    try {
      const { array } = await this.requestManager.createRequest({
        url: "/tickets/{ticketId}/comments",
        method: METHODS.GET,
        responseDataFieldPath: ["list"],
        serverDataEntityDecoder: arrayOfTicketCommentEntitiesDecoder,
      })({ urlParams: { ticketId: this.ticketsStorage.ticketDetail!.id } });
      this.comments = array;
      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action createComment = async (entity: EditTicketCommentEntity) => {
    try {
      const { id: commentId } = await this.requestManager.createRequest({
        url: "/tickets/{ticketId}/comments",
        method: METHODS.POST,
        serverDataEntityDecoder: IdEntity,
      })({ urlParams: { ticketId: entity.apiCreateReady.ticketId }, body: entity.apiCreateReady.body.excludeText });

      const uploadResults = await Promise.all(
        entity.attachments.map((attachment) =>
          updateFileRequest(null, attachment, {
            uploadFile: (body) =>
              this.requestManager.createRequest({
                url: "/tickets/comments/{commentId}/upload",
                method: METHODS.POST,
                serverDataEntityDecoder: FileEntity,
              })({
                urlParams: { commentId },
                body,
                progressReceiver: attachment.setProgress,
              }),
            deleteFile: () => null!,
          }),
        ),
      );

      await this.requestManager.createRequest({
        url: "/tickets/comments/{commentId}",
        method: METHODS.PATCH,
      })({
        urlParams: { commentId },
        body: {
          isPartOfTransaction: true,
          text: prepareTextEditorHtmlToSave(entity.apiUpdateReady.body.onlyText.text, { uploadResults }),
        },
      });

      return { success: true, commentId, uploadResults } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action updateComment = async (entity: EditTicketCommentEntity) => {
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
                url: "/tickets/comments/{commentId}/upload",
                method: METHODS.POST,
                serverDataEntityDecoder: FileEntity,
              })({
                urlParams: { commentId: entity.apiUpdateReady.commentId },
                body,
                progressReceiver: attachment.setProgress,
              })
              .then((entity) => {
                attachment.setProgress(undefined);
                return entity;
              }),
          deleteFile: (fileId) =>
            this.requestManager.createRequest({
              url: "/tickets/comments/{commentId}/delete-file/{fileId}",
              method: METHODS.DELETE,
            })({
              urlParams: { fileId, commentId: entity.apiUpdateReady.commentId },
            }),
        },
      );

      await this.requestManager.createRequest({
        url: "/tickets/comments/{commentId}",
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
        url: "/tickets/comments/{commentId}",
        method: METHODS.DELETE,
      })({ urlParams: { commentId } });
      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };
}
