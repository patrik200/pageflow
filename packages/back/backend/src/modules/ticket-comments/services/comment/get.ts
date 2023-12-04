import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { typeormAlias } from "@app/back-kit";

import { TicketCommentEntity } from "entities/Ticket/Comment";

import { getCurrentUser } from "modules/auth";

@Injectable()
export class GetTicketCommentsService {
  constructor(@InjectRepository(TicketCommentEntity) private commentsRepository: Repository<TicketCommentEntity>) {}

  async getCommentOrFail(commentId: string, options: { loadFiles?: boolean } = {}) {
    const currentUser = getCurrentUser();
    const comment = await this.commentsRepository.findOneOrFail({
      where: { id: commentId, ticket: { client: { id: currentUser.clientId } } },
      join: { alias: typeormAlias, innerJoin: { ticket: typeormAlias + ".ticket", client: "ticket.client" } },
      relations: {
        files: options.loadFiles ? { file: true } : false,
      },
    });
    comment.calculateAllCans(currentUser);
    return comment;
  }
}
