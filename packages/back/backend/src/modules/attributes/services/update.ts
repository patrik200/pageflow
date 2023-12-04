import { AttributeCategory } from "@app/shared-enums";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsRelations, FindOptionsWhere, Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { uniq } from "@worksolutions/utils";
import { DeepPartial } from "typeorm/common/DeepPartial";

import { AttributeValueEntity } from "entities/Attribute/value";
import { CorrespondenceEntity } from "entities/Correspondence/Correspondence";
import { DocumentEntity } from "entities/Document/Document";
import { AttributeTypeEntity } from "entities/Attribute";

import { getCurrentUser } from "modules/auth";

import { GetOrCreateAttributeTypeService } from "./get-or-create-type";
import { GetOrCreateAttributeValueService } from "./get-or-create-value";

type UpdateAttributesIdentifier = {
  entityId: string;
  category: AttributeCategory;
};

export interface UpdatableAttributeInterface {
  typeKey: string;
  value: string;
}

@Injectable()
export class UpdateAttributesService {
  constructor(
    private getOrCreateAttributeTypeService: GetOrCreateAttributeTypeService,
    private getOrCreateAttributeValueService: GetOrCreateAttributeValueService,
    @InjectRepository(AttributeValueEntity) private attributeValueRepository: Repository<AttributeValueEntity>,
    @InjectRepository(AttributeTypeEntity) private attributeTypeRepository: Repository<AttributeTypeEntity>,
  ) {}

  private async getCurrentAttributeValues(identifier: UpdateAttributesIdentifier) {
    const whereOptions: FindOptionsWhere<AttributeValueEntity> = {};
    const relations: FindOptionsRelations<AttributeValueEntity> = { attributeType: true };

    if (identifier.category === AttributeCategory.DOCUMENT) {
      whereOptions.documents = { id: identifier.entityId };
      relations.documents = true;
    }

    if (identifier.category === AttributeCategory.CORRESPONDENCE) {
      whereOptions.correspondences = { id: identifier.entityId };
      relations.correspondences = true;
    }

    return await this.attributeValueRepository.find({ where: whereOptions, relations });
  }

  @Transactional()
  private async unlinkAttributeValuesFromEntity(identifier: UpdateAttributesIdentifier) {
    const attributeValues = await this.getCurrentAttributeValues(identifier);
    await Promise.all(
      attributeValues.map(async (attributeValue) => {
        const updateOptions: DeepPartial<AttributeValueEntity> = { id: attributeValue.id };

        if (identifier.category === AttributeCategory.DOCUMENT)
          updateOptions.documents = attributeValue.documents.filter((document) => document.id !== identifier.entityId);

        if (identifier.category === AttributeCategory.CORRESPONDENCE)
          updateOptions.correspondences = attributeValue.correspondences.filter(
            (correspondence) => correspondence.id !== identifier.entityId,
          );

        await this.attributeValueRepository.save(updateOptions);
      }),
    );
  }

  @Transactional()
  private async createAttributes(
    identifier: UpdateAttributesIdentifier,
    updatableAttributes: UpdatableAttributeInterface[],
  ) {
    const attributeTypes = new Map(
      await Promise.all(
        uniq(updatableAttributes.map((attribute) => attribute.typeKey)).map(async (typeKey) => {
          const attributeType = await this.getOrCreateAttributeTypeService.getOrCreateAttributeType({
            category: identifier.category,
            key: typeKey,
          });
          return [attributeType.key, attributeType] as const;
        }),
      ),
    );

    const attributes = await Promise.all(
      updatableAttributes.map(
        async (attribute) =>
          await this.getOrCreateAttributeValueService.getOrCreateAttributeValue({
            attributeTypeId: attributeTypes.get(attribute.typeKey)!.id,
            value: attribute.value,
          }),
      ),
    );

    return attributes.map((attribute) => ({
      attributeId: attribute.id,
      attributeTypeKey: attribute.attributeType.key,
      value: attribute.value,
    }));
  }

  @Transactional()
  private async setAttributesToEntity(
    identifier: UpdateAttributesIdentifier,
    updatableAttributes: UpdatableAttributeInterface[],
  ) {
    const attributes = await this.createAttributes(identifier, updatableAttributes);

    let relationEntity: typeof DocumentEntity | typeof CorrespondenceEntity = null!;
    if (identifier.category === AttributeCategory.DOCUMENT) relationEntity = DocumentEntity;
    if (identifier.category === AttributeCategory.CORRESPONDENCE) relationEntity = CorrespondenceEntity;

    await this.attributeValueRepository
      .createQueryBuilder()
      .relation(relationEntity, "attributeValues")
      .of(identifier.entityId)
      .add(attributes.map((attribute) => attribute.attributeId));

    return attributes;
  }

  @Transactional()
  private async removeAttributesWithoutEntities(category: AttributeCategory) {
    const whereOptions: FindOptionsWhere<AttributeValueEntity> = {
      attributeType: { category, client: { id: getCurrentUser().clientId } },
    };

    const attributeValues = await this.attributeValueRepository.find({
      where: whereOptions,
      relations: { attributeType: true, documents: true, correspondences: true },
    });

    const attributeValuesWithoutEntities = attributeValues.filter((attributeValue) => {
      if (category === AttributeCategory.DOCUMENT) return attributeValue.documents.length === 0;
      if (category === AttributeCategory.CORRESPONDENCE) return attributeValue.correspondences.length === 0;
      throw new Error("unknown state");
    });

    if (attributeValuesWithoutEntities.length === 0) return;

    await this.attributeValueRepository.delete(
      attributeValuesWithoutEntities.map((attributeValue) => attributeValue.id),
    );
  }

  @Transactional()
  private async removeEmptyAttributeTypes(category: AttributeCategory) {
    const attributeTypes = await this.attributeTypeRepository.find({
      where: { category, client: { id: getCurrentUser().clientId } },
      relations: { attributes: true },
    });

    const emptyAttributeTypes = attributeTypes.filter((attributeType) => attributeType.attributes.length === 0);
    if (emptyAttributeTypes.length === 0) return;
    await this.attributeTypeRepository.delete(emptyAttributeTypes.map((attributeType) => attributeType.id));
  }

  @Transactional()
  async unsafeUpdateAttributes(
    identifier: UpdateAttributesIdentifier,
    attributes: UpdatableAttributeInterface[] | undefined,
  ) {
    if (!attributes) return;

    await this.unlinkAttributeValuesFromEntity(identifier);
    const newAttributes = await this.setAttributesToEntity(identifier, attributes);
    await this.removeAttributesWithoutEntities(identifier.category);
    await this.removeEmptyAttributeTypes(identifier.category);

    return newAttributes;
  }
}
