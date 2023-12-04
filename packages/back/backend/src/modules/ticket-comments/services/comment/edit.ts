import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ServiceError, filterHtml } from "@app/back-kit";
import { Transactional } from "typeorm-transactional";
import { EventEmitter2 } from "@nestjs/event-emitter";

import { TicketCommentEntity } from "entities/Ticket/Comment";

import { GetTicketCommentsForEditService } from "./get-for-edit";
import { TicketCommentUpdated } from "../../events/CommentUpdated";

interface UpdateTicketInterface {
  text?: string;
  isPartOfTransaction: boolean;
}

@Injectable()
export class EditTicketCommentsService {
  constructor(
    @InjectRepository(TicketCommentEntity) private commentsRepository: Repository<TicketCommentEntity>,
    private getCommentsForEditService: GetTicketCommentsForEditService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Transactional()
  async updateCommentOrFail(commentId: string, data: UpdateTicketInterface) {
    const comment = await this.getCommentsForEditService.getCommentForUpdating(commentId);
    if (!comment.canUpdate) throw new ServiceError("file", "Вы не можете редактировать этот комментарий");

    await this.commentsRepository.update(
      comment.id,
      Object.assign(
        {},
        data.isPartOfTransaction ? undefined : { updated: true },
        data.text ? { text: filterHtml(data.text) } : undefined,
      ),
    );

    this.eventEmitter.emit(TicketCommentUpdated.eventName, new TicketCommentUpdated(comment.id));
  }
}
