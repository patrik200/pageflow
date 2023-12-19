import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ServiceError } from "@app/back-kit";
import { Transactional } from "typeorm-transactional";
import { EventEmitter2 } from "@nestjs/event-emitter";

import { TicketCommentEntity } from "entities/Ticket/Comment";
import { TicketCommentFileEntity } from "entities/Ticket/Comment/File";

import { DeleteFileService } from "modules/storage";

import { GetTicketCommentsForEditService } from "../comment/get-for-edit";
import { TicketCommentUpdated } from "../../events/CommentUpdated";

@Injectable()
export class DeleteTicketCommentFilesService {
  constructor(
    @InjectRepository(TicketCommentEntity) private commentsRepository: Repository<TicketCommentEntity>,
    @InjectRepository(TicketCommentFileEntity)
    private commentFilesRepository: Repository<TicketCommentFileEntity>,
    private deleteFileService: DeleteFileService,
    private getCommentsForEditService: GetTicketCommentsForEditService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Transactional()
  async deleteCommentFileOrFail(
    commentId: string,
    fileId: string,
    { checkPermissions = true, emitEvents = true }: { checkPermissions?: boolean; emitEvents?: boolean } = {},
  ) {
    const comment = await this.getCommentsForEditService.getCommentForUpdating(commentId);
    if (checkPermissions) {
      if (!comment.canUpdate) throw new ServiceError("file", "Вы не можете редактировать этот комментарий");
    }

    await this.commentsRepository.update(comment.id, { updated: true });

    const commentFile = await this.commentFilesRepository.findOneOrFail({
      where: { file: { id: fileId }, comment: { id: comment.id } },
      relations: { comment: true, file: true },
    });
    await this.commentFilesRepository.delete(commentFile.id);
    await this.deleteFileService.deleteFileOrFail(commentFile.file);

    if (emitEvents) this.eventEmitter.emit(TicketCommentUpdated.eventName, new TicketCommentUpdated(comment.id));
  }
}
