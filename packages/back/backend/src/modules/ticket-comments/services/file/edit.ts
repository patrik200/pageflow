import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ExpressMultipartFile, FileUploaderService, ServiceError } from "@app/back-kit";
import { Transactional } from "typeorm-transactional";
import { EventEmitter2 } from "@nestjs/event-emitter";

import { TicketCommentEntity } from "entities/Ticket/Comment";
import { TicketCommentFileEntity } from "entities/Ticket/Comment/File";

import { getCurrentUser } from "modules/auth";

import { TicketCommentUpdated } from "../../events/CommentUpdated";
import { GetTicketCommentsForEditService } from "../comment/get-for-edit";

@Injectable()
export class EditTicketCommentFilesService {
  constructor(
    @InjectRepository(TicketCommentEntity) private commentsRepository: Repository<TicketCommentEntity>,
    @InjectRepository(TicketCommentFileEntity)
    private commentFilesRepository: Repository<TicketCommentFileEntity>,
    private fileUploaderService: FileUploaderService,
    private getCommentsForEditService: GetTicketCommentsForEditService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Transactional()
  async uploadCommentFileOrFail(commentId: string, file: ExpressMultipartFile) {
    const comment = await this.getCommentsForEditService.getCommentForUpdating(commentId);
    if (!comment.canUpdate) throw new ServiceError("file", "Вы не можете редактировать этот комментарий");

    await this.commentsRepository.update(comment.id, {});

    const uploadedFile = await this.fileUploaderService.uploadFileOrFail(
      `client.${getCurrentUser().clientId}.tickets`,
      file,
    );

    const savedCommentFile = await this.commentFilesRepository.save({
      file: { id: uploadedFile.id },
      comment: { id: comment.id },
    });

    this.eventEmitter.emit(TicketCommentUpdated.eventName, new TicketCommentUpdated(comment.id));

    return { id: savedCommentFile.id, file: uploadedFile };
  }
}
