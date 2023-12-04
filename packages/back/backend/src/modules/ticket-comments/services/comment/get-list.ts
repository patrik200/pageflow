import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { typeormAlias } from "@app/back-kit";

import { TicketCommentEntity } from "entities/Ticket/Comment";

import { getCurrentUser } from "modules/auth";

@Injectable()
export class GetTicketCommentsListService {
  constructor(@InjectRepository(TicketCommentEntity) private commentsRepository: Repository<TicketCommentEntity>) {}

  async getCommentsListOrFail(
    ticketId: string,
    options: {
      loadAuthor?: boolean;
      loadAuthorAvatar?: boolean;
      loadFiles?: boolean;
    } = {},
  ) {
    const currentUser = getCurrentUser();
    const comments = await this.commentsRepository.find({
      where: { ticket: { id: ticketId, client: { id: currentUser.clientId } } },
      join: { alias: typeormAlias, innerJoin: { ticket: typeormAlias + ".ticket", client: "ticket.client" } },
      order: { createdAt: "DESC" },
      relations: {
        author: options.loadAuthor
          ? {
              avatar: options.loadAuthorAvatar,
            }
          : false,
        files: options.loadFiles ? { file: true } : false,
      },
    });
    comments.forEach((comment) => comment.calculateAllCans(currentUser));
    return comments;
  }
}
