import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { typeormAlias } from "@app/back-kit";

import { TicketCommentEntity } from "entities/Ticket/Comment";

import { getCurrentUser } from "modules/auth";

@Injectable()
export class GetTicketCommentsForEditService {
  constructor(@InjectRepository(TicketCommentEntity) private commentsRepository: Repository<TicketCommentEntity>) {}

  async getCommentForUpdating(commentId: string) {
    const currentUser = getCurrentUser();
    const comment = await this.commentsRepository.findOneOrFail({
      where: { id: commentId, ticket: { client: { id: currentUser.clientId } } },
      join: { alias: typeormAlias, innerJoin: { ticket: typeormAlias + ".ticket", client: "ticket.client" } },
    });
    comment.calculateAllCans(currentUser);
    return comment;
  }
}
