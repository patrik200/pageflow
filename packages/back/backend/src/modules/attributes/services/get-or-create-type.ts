import { AttributeCategory } from "@app/shared-enums";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { AttributeTypeEntity } from "entities/Attribute";

import { getCurrentUser } from "modules/auth";

type GetOrCreateAttributeTypeIdentifier = {
  category: AttributeCategory;
  key: string;
};

@Injectable()
export class GetOrCreateAttributeTypeService {
  constructor(
    @InjectRepository(AttributeTypeEntity) private attributeTypeRepository: Repository<AttributeTypeEntity>,
  ) {}

  async getOrCreateAttributeType(identifier: GetOrCreateAttributeTypeIdentifier) {
    const attributeType = await this.attributeTypeRepository.findOne({
      where: { category: identifier.category, key: identifier.key, client: { id: getCurrentUser().clientId } },
    });

    if (attributeType) return attributeType;

    return await this.attributeTypeRepository.save({
      category: identifier.category,
      key: identifier.key,
      client: { id: getCurrentUser().clientId },
    });
  }
}
