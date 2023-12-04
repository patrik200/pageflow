import { BaseEntity, makeFnTransformableObject } from "@app/kit";
import { observable, computed } from "mobx";

import { EditableFileEntity } from "core/entities/file";

export class ApproveUserFlowRowUserEntity extends BaseEntity {
  static buildForRowUser(rowUserId: string) {
    return makeFnTransformableObject(() => new ApproveUserFlowRowUserEntity(rowUserId));
  }

  constructor(private rowUserId: string) {
    super();
    this.initEntity();
  }

  @observable result = "";
  setResult = this.createSetter("result");

  @observable attachments: EditableFileEntity[] = [];
  addAttachments = this.createPushArray("attachments");
  deleteAttachmentByIndex = this.createDeleteByIndex("attachments");

  @computed get apiReadyBody() {
    return {
      result: this.result,
      attachments: this.attachments,
    };
  }

  @computed get apiReadyParam() {
    return { rowUserId: this.rowUserId };
  }
}
