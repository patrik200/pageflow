import { computed, observable } from "mobx";
import { BaseEntity, makeFnTransformableObject } from "@app/kit";
import { MinLength } from "class-validator";

import { NOT_EMPTY_VALIDATION } from "core/commonValidationErrors";

import { EditableFileEntity } from "core/entities/file";
import { DocumentRevisionDetailEntity } from "core/entities/documentRevision/revisionDetail";

export class EditDocumentRevisionEntity extends BaseEntity {
  static buildEmpty(documentId: string) {
    return makeFnTransformableObject(() => new EditDocumentRevisionEntity(documentId));
  }

  static buildFromRevisionEntity(revision: DocumentRevisionDetailEntity) {
    return makeFnTransformableObject(
      () => new EditDocumentRevisionEntity(revision.document.id, revision.id),
      () => ({
        number: revision.number,
        approvingDeadline: revision.approvingDeadline,
        canProlongApprovingDeadline: revision.canProlongApprovingDeadline,
        responsibleUser: revision.responsibleUser?.user.id ?? null,
        responsibleUserFlow: revision.responsibleUserFlow ? "" : null,
        attachments: revision.files.map((file) => file.toEditableFileEntity()),
      }),
    );
  }

  constructor(private documentId: string, public revisionId?: string) {
    super();
    this.initEntity();
  }

  @observable @MinLength(1, { message: NOT_EMPTY_VALIDATION }) number = "";
  setNumber = this.createSetter("number");

  @observable approvingDeadline: Date | null = null;
  setApprovingDeadline = this.createSetter("approvingDeadline");

  @observable canProlongApprovingDeadline = false;
  setCanProlongApprovingDeadline = this.createSetter("canProlongApprovingDeadline");

  @observable responsibleUser: string | null = null;
  setResponsibleUser = this.createSetter("responsibleUser");

  @observable responsibleUserFlow: string | null = null;
  setResponsibleUserFlow = this.createSetter("responsibleUserFlow");

  @observable attachments: EditableFileEntity[] = [];
  addAttachments = this.createPushArray("attachments");
  deleteAttachmentByIndex = this.createDeleteByIndex("attachments");

  @computed get apiCreateReady() {
    return {
      documentId: this.documentId,
      body: {
        number: this.number,
        approvingDeadline: this.approvingDeadline,
        canProlongApprovingDeadline: this.canProlongApprovingDeadline,
        responsibleUserId: this.responsibleUser,
        responsibleUserFlowId: this.responsibleUserFlow,
      },
    };
  }

  @computed get apiUpdateReady() {
    return {
      revisionId: this.revisionId!,
      body: {
        number: this.number,
        approvingDeadline: this.approvingDeadline,
        canProlongApprovingDeadline: this.canProlongApprovingDeadline,
        responsibleUserId: this.responsibleUser,
        responsibleUserFlowId: this.responsibleUserFlow === "" ? undefined : this.responsibleUserFlow,
      },
    };
  }
}
