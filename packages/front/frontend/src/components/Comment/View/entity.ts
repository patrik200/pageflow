import { action, computed, observable } from "mobx";
import { BaseEntity, makeFnTransformableObject, makeTransformableObject } from "@app/kit";

import { FileEntity, EditableFileEntity } from "core/entities/file";

export class EditCommentEntity extends BaseEntity {
  static buildEmptyEntity() {
    return makeTransformableObject(EditCommentEntity);
  }

  static buildEntity(commentId: string, options: { text: string; attachments: FileEntity[] }) {
    return makeFnTransformableObject(
      () => new EditCommentEntity(commentId),
      () => ({
        text: options.text,
        attachments: options.attachments.map((attachment) => attachment.toEditableFileEntity()),
      }),
    );
  }

  constructor(public id?: string) {
    super();
    this.initEntity();
  }

  @observable text = "";
  setText = this.createSetter("text");

  @observable attachments: EditableFileEntity[] = [];
  addAttachments = this.createPushArray("attachments");
  addAttachment = this.createPush("attachments");
  deleteAttachmentByIndex = this.createDeleteByIndex("attachments");

  @action clear() {
    this.setText("");
    this.attachments = [];
  }

  @computed get isEmpty() {
    return this.text.length === 0 && this.attachments.length === 0;
  }
}
