import { AttributeCategory } from "@app/shared-enums";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";

import { AttributeTypeEntity } from "entities/Attribute";

import { getCurrentUser } from "modules/auth";

type GetAttributeTypesIdentifier = {
  category: AttributeCategory;
  search?: string;
};

@Injectable()
export class GetAttributeTypesService {
  constructor(@InjectRepository(AttributeTypeEntity) private attributeRepository: Repository<AttributeTypeEntity>) {}

  @Transactional()
  async getAttributeTypesOrFail(identifier: GetAttributeTypesIdentifier) {
    return await this.attributeRepository.find({
      where: {
        category: identifier.category,
        client: { id: getCurrentUser().clientId },
      },
      order: { createdAt: "ASC" },
    });
  }
}
