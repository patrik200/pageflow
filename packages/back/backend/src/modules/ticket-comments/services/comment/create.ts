import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { filterHtml } from "@app/back-kit";
import { Transactional } from "typeorm-transactional";
import { EventEmitter2 } from "@nestjs/event-emitter";

import { TicketCommentEntity } from "entities/Ticket/Comment";

import { GetTicketService } from "modules/tickets";

import { TicketCommentCreated } from "../../events/CommentCreated";
import { GetTicketCommentsService } from "./get";

interface CreateTicketCommentInterface {
  text: string;
  authorId: string;
  replyForCommentId?: string;
}

@Injectable()
export class CreateTicketCommentsService {
  constructor(
    @InjectRepository(TicketCommentEntity) private commentsRepository: Repository<TicketCommentEntity>,
    private getCommentsService: GetTicketCommentsService,
    @Inject(forwardRef(() => GetTicketService)) private getTicketService: GetTicketService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Transactional()
  async createCommentOrFail(ticketId: string, data: CreateTicketCommentInterface) {
    const ticket = await this.getTicketService.getTicketOrFail(ticketId, "id");

    const replyForTicketComment = data.replyForCommentId
      ? await this.getCommentsService.getCommentOrFail(data.replyForCommentId)
      : null;

    const savedComment = await this.commentsRepository.save({
      ticket: { id: ticket.id },
      author: { id: data.authorId },
      text: filterHtml(data.text),
      updated: false,
      replyFor: replyForTicketComment ? { id: replyForTicketComment.id } : undefined,
    });

    this.eventEmitter.emit(TicketCommentCreated.eventName, new TicketCommentCreated(savedComment));

    return savedComment.id;
  }
}
