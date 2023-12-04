import { computed } from "mobx";
import { makeFnTransformableObject } from "@app/kit";

import { EditCommentEntity } from "components/Comment/View/entity";

export class EditTicketCommentEntity extends EditCommentEntity {
  static buildFromEditCommentEntity(entity: EditCommentEntity, options?: { ticketId?: string }) {
    return makeFnTransformableObject(
      () => new EditTicketCommentEntity({ commentId: entity.id, ticketId: options?.ticketId }),
      () => ({ text: entity.text, attachments: entity.attachments }),
    );
  }

  constructor(private options: { commentId?: string; ticketId?: string }) {
    super("commentId" in options ? options.commentId : undefined);
    this.initEntity();
  }

  @computed get apiCreateReady() {
    return {
      ticketId: this.options.ticketId!,
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
