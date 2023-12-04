import { computed } from "mobx";
import { makeFnTransformableObject } from "@app/kit";

import { EditCommentEntity } from "components/Comment/View/entity";

export class EditCorrespondenceRevisionCommentEntity extends EditCommentEntity {
  static buildFromEditCommentEntity(entity: EditCommentEntity, options?: { revisionId?: string }) {
    return makeFnTransformableObject(
      () => new EditCorrespondenceRevisionCommentEntity({ commentId: entity.id, revisionId: options?.revisionId }),
      () => ({ text: entity.text, attachments: entity.attachments }),
    );
  }

  constructor(private options: { commentId?: string; revisionId?: string }) {
    super("commentId" in options ? options.commentId : undefined);
    this.initEntity();
  }

  @computed get apiCreateReady() {
    return {
      revisionId: this.options.revisionId!,
      body: {
        onlyText: { text: this.text },
        excludeText: { text: "" },
      },
    };
  }

  @computed get apiUpdateReady() {
    return {
      commentId: this.options.commentId!,
      body: {
        onlyText: { text: this.text },
        excludeText: {},
      },
    };
  }
}
