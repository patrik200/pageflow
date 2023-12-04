import { AttributeCategory } from "@app/shared-enums";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";

import { AttributeTypeEntity } from "entities/Attribute";
import { AttributeValueEntity } from "entities/Attribute/value";

import { getCurrentUser } from "modules/auth";

type GetAttributeValuesIdentifier = {
  category: AttributeCategory;
  attributeTypeKey: string;
};

@Injectable()
export class GetAttributeValuesService {
  constructor(
    @InjectRepository(AttributeTypeEntity)
    private attributeTypeRepository: Repository<AttributeTypeEntity>,
    @InjectRepository(AttributeValueEntity)
    private attributeValueRepository: Repository<AttributeValueEntity>,
  ) {}

  @Transactional()
  async getAttributeValuesOrFail(identifier: GetAttributeValuesIdentifier) {
    const attributeType = await this.attributeTypeRepository.findOne({
      where: {
        key: identifier.attributeTypeKey,
        category: identifier.category,
        client: { id: getCurrentUser().clientId },
      },
    });

    if (!attributeType) return [];

    return await this.attributeValueRepository.find({ where: { attributeType: { id: attributeType.id } } });
  }
}
