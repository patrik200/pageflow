import { DictionaryTypes } from "@app/shared-enums";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { typeormAlias } from "@app/back-kit";

import { TicketEntity } from "entities/Ticket";
import { ProjectEntity } from "entities/Project";

import { GetDictionaryValuesListService } from "modules/dictionary";

@Injectable()
export class GetActiveTicketsCountService {
  constructor(
    @Inject(forwardRef(() => GetDictionaryValuesListService))
    private getDictionaryValuesListService: GetDictionaryValuesListService,
    @InjectRepository(TicketEntity) private ticketRepository: Repository<TicketEntity>,
  ) {}

  async unsafeGetActiveTicketsCountForProject(projectId: string) {
    const statuses = await this.getDictionaryValuesListService.getDictionaryValuesListOrFail(
      DictionaryTypes.TICKET_STATUS,
    );

    return await this.ticketRepository.count({
      where: {
        board: { project: { id: projectId } },
        status: statuses
          .filter((status) => !["archived", "finished"].includes(status.key))
          .map((status) => ({ id: status.id })),
      },
      join: {
        alias: typeormAlias,
        leftJoin: {
          board: typeormAlias + ".board",
          boardProject: "board.project",
        },
      },
    });
  }

  async unsafeLoadActiveTicketsCountForBoard(project: ProjectEntity) {
    project.activeTicketsCount = await this.unsafeGetActiveTicketsCountForProject(project.id);
    return project;
  }
}
