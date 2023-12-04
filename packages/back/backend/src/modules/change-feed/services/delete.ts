import { ChangeFeedEntityType } from "@app/shared-enums";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";

import { ChangeFeedEventEntity } from "entities/ChangeFeed";

import { getCurrentUser } from "modules/auth";

export interface DeleteChangeFeedEvent {
  entityId: string;
  entityType: ChangeFeedEntityType;
}

@Injectable()
export class DeleteChangeFeedEventService {
  constructor(
    @InjectRepository(ChangeFeedEventEntity) private changeFeedEventRepository: Repository<ChangeFeedEventEntity>,
  ) {}

  @Transactional()
  async deleteAllChangeFeedEventsOrFail(event: DeleteChangeFeedEvent) {
    await this.changeFeedEventRepository.delete({
      client: { id: getCurrentUser().clientId },
      entityId: event.entityId,
      entityType: event.entityType,
    });
  }
}
