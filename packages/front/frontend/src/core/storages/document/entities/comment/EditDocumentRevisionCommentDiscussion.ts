import { computed } from "mobx";
import { makeFnTransformableObject } from "@app/kit";

import { EditCommentEntity } from "components/Comment/View/entity";

export class EditDocumentRevisionCommentDiscussionEntity extends EditCommentEntity {
  static buildFromEditCommentEntity(commentId: string, entity: EditCommentEntity) {
    return makeFnTransformableObject(
      () => new EditDocumentRevisionCommentDiscussionEntity({ commentId, discussionId: entity.id }),
      () => ({ text: entity.text, attachments: entity.attachments }),
    );
  }

  constructor(private options: { commentId: string; discussionId?: string }) {
    super("discussionId" in options ? options.discussionId : undefined);
    this.initEntity();
  }

  @computed get apiCreateReady() {
    return {
      url: { commentId: this.options.commentId },
      body: {
        onlyText: { text: this.text },
        excludeText: { text: "" },
      },
    };
  }

  @computed get apiUpdateReady() {
    return {
      url: { discussionId: this.id! },
      body: {
        onlyText: { text: this.text },
        excludeText: {},
      },
    };
  }
}
