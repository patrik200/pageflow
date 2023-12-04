import { computed, observable } from "mobx";
import { BaseEntity, makeFnTransformableObject } from "@app/kit";
import { MinLength } from "class-validator";
import { uniqBy } from "@worksolutions/utils";

import { NOT_EMPTY_VALIDATION } from "core/commonValidationErrors";

import { CorrespondenceEntity } from "core/entities/correspondence/correspondence";
import { PermissionEntity } from "core/entities/permission/permision";

import { AttributeInEntityEntity } from "../../../../entities/attributes/attribute-in-entity";

export class EditCorrespondenceEntity extends BaseEntity {
  static build(parentGroupId: string | undefined, options?: { projectId?: string }) {
    return makeFnTransformableObject(() => new EditCorrespondenceEntity({ parentGroupId, ...options }));
  }

  static buildFromCorrespondenceDetailForClient(correspondence: CorrespondenceEntity) {
    return makeFnTransformableObject(
      () => new EditCorrespondenceEntity({ id: correspondence.id }),
      () => ({
        isPrivate: correspondence.isPrivate,
        name: correspondence.name,
        description: correspondence.description,
        attributeValues: [...correspondence.attributeValues],
        permissions: [...correspondence.permissions],
      }),
    );
  }

  constructor(public options: { parentGroupId?: string; id?: string; projectId?: string }) {
    super();
    this.initEntity();
  }

  @observable isPrivate = false;
  setIsPrivate = this.createSetter("isPrivate");

  @observable @MinLength(1, { message: NOT_EMPTY_VALIDATION }) name = "";
  setName = this.createSetter("name");

  @observable description = "";
  setDescription = this.createSetter("description");

  @observable attributeValues: AttributeInEntityEntity[] = [];
  addAttributeValue = this.createPush("attributeValues");
  deleteAttributeValueByIndex = this.createDeleteByIndex("attributeValues");

  @observable permissions: PermissionEntity[] = [];

  private get attributesForApi() {
    return uniqBy(
      (attribute) => attribute.typeKey + "___-_-_-___" + attribute.value,
      this.attributeValues.map((attribute) => ({
        typeKey: attribute.attributeType.key,
        value: attribute.value,
      })),
    );
  }

  @computed get apiCreateReady() {
    return {
      parentGroupId: this.options.parentGroupId,
      name: this.name,
      description: this.description || undefined,
      projectId: this.options.projectId,
      isPrivate: this.isPrivate,
      attributes: this.attributesForApi,
    };
  }

  @computed get apiUpdateReady() {
    return {
      name: this.name,
      description: this.description || undefined,
      isPrivate: this.isPrivate,
      attributes: this.attributesForApi,
    };
  }
}
