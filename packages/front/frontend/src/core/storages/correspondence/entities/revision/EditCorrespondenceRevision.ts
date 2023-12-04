import { computed, observable } from "mobx";
import { BaseEntity, makeFnTransformableObject } from "@app/kit";
import { MinLength } from "class-validator";

import { NOT_EMPTY_VALIDATION } from "core/commonValidationErrors";

import { EditableFileEntity } from "core/entities/file";
import { CorrespondenceRevisionDetailEntity } from "core/entities/correspondenceRevision/revisionDetail";

export class EditCorrespondenceRevisionEntity extends BaseEntity {
  static buildEmpty(correspondenceId: string) {
    return makeFnTransformableObject(() => new EditCorrespondenceRevisionEntity(correspondenceId));
  }

  static buildFromRevisionEntity(revision: CorrespondenceRevisionDetailEntity) {
    return makeFnTransformableObject(
      () => new EditCorrespondenceRevisionEntity(revision.correspondence.id, revision.id),
      () => ({
        number: revision.number,
        attachments: revision.files.map((file) => file.toEditableFileEntity()),
      }),
    );
  }

  constructor(private correspondenceId: string, public revisionId?: string) {
    super();
    this.initEntity();
  }

  @observable @MinLength(1, { message: NOT_EMPTY_VALIDATION }) number = "";
  setNumber = this.createSetter("number");

  @observable attachments: EditableFileEntity[] = [];
  addAttachments = this.createPushArray("attachments");
  deleteAttachmentByIndex = this.createDeleteByIndex("attachments");

  @computed get apiCreateReady() {
    return {
      correspondenceId: this.correspondenceId,
      body: {
        number: this.number,
      },
    };
  }

  @computed get apiUpdateReady() {
    return {
      revisionId: this.revisionId!,
      body: {
        number: this.number,
      },
    };
  }
}
