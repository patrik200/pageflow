import { ChangeFeedEntityType } from "@app/shared-enums";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";

import { ChangeFeedEventEntity } from "entities/ChangeFeed";

import { getCurrentUser } from "modules/auth";

export interface CreateChangeFeedEvent<DATA extends Record<string, any>> {
  entityId: string;
  entityType: ChangeFeedEntityType;
  eventType: string;
  data: DATA;
}

@Injectable()
export class CreateChangeFeedEventService {
  constructor(
    @InjectRepository(ChangeFeedEventEntity) private changeFeedEventRepository: Repository<ChangeFeedEventEntity>,
  ) {}

  @Transactional()
  async createChangeFeedEventOrFail<DATA extends Record<string, any>>(
    event: CreateChangeFeedEvent<DATA>,
  ): Promise<Partial<DATA>> {
    const currentUser = getCurrentUser();

    const data = Object.entries(event.data).filter(([, value]) => value !== undefined);
    if (data.length === 0) return {};

    const changes = Object.fromEntries(data);

    await this.changeFeedEventRepository.save({
      client: { id: currentUser.clientId },
      author: { id: currentUser.userId },
      ...event,
      data: changes,
    });

    return changes as DATA;
  }
}
