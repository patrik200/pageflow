import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { AttributeValueEntity } from "entities/Attribute/value";

import { getCurrentUser } from "../../auth";

type GetOrCreateAttributeValueIdentifier = {
  attributeTypeId: string;
  value: string;
};

@Injectable()
export class GetOrCreateAttributeValueService {
  constructor(
    @InjectRepository(AttributeValueEntity)
    private attributeValueRepository: Repository<AttributeValueEntity>,
  ) {}

  async getOrCreateAttributeValue(identifier: GetOrCreateAttributeValueIdentifier) {
    const attributeValue = await this.attributeValueRepository.findOne({
      where: {
        attributeType: { id: identifier.attributeTypeId, client: { id: getCurrentUser().clientId } },
        value: identifier.value,
      },
      relations: { attributeType: true },
    });

    if (attributeValue) return attributeValue;

    return await this.attributeValueRepository.save({
      attributeType: { id: identifier.attributeTypeId },
      value: identifier.value,
    });
  }
}
