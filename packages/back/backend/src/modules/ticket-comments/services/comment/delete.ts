import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ServiceError } from "@app/back-kit";
import { Transactional } from "typeorm-transactional";
import { EventEmitter2 } from "@nestjs/event-emitter";

import { TicketCommentEntity } from "entities/Ticket/Comment";

import { TicketCommentDeleted } from "../../events/CommentDeleted";
import { DeleteTicketCommentFilesService } from "../file/delete";
import { GetTicketCommentsService } from "./get";

@Injectable()
export class DeleteTicketCommentsService {
  constructor(
    @InjectRepository(TicketCommentEntity) private commentsRepository: Repository<TicketCommentEntity>,
    private getCommentsService: GetTicketCommentsService,
    private deleteFilesService: DeleteTicketCommentFilesService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Transactional()
  async deleteCommentOrFail(commentId: string, { checkPermissions = true }: { checkPermissions?: boolean } = {}) {
    const originalComment = await this.getCommentsService.getCommentOrFail(commentId, {
      loadFiles: true,
    });

    if (checkPermissions) {
      if (!originalComment.canUpdate) throw new ServiceError("author", "Вы не можете удалить этот комментарий");
    }

    await Promise.all(
      originalComment.files.map((commentFile) =>
        this.deleteFilesService.deleteCommentFileOrFail(originalComment.id, commentFile.file.id, {
          checkPermissions,
        }),
      ),
    );

    await this.commentsRepository.delete(originalComment.id);

    this.eventEmitter.emit(TicketCommentDeleted.eventName, new TicketCommentDeleted(originalComment.id));
  }
}
