import { computed, observable } from "mobx";
import { BaseEntity, makeFnTransformableObject } from "@app/kit";
import { MinLength } from "class-validator";
import { uniqBy } from "@worksolutions/utils";

import { NOT_EMPTY_VALIDATION } from "core/commonValidationErrors";

import { DocumentEntity } from "core/entities/document/document";
import { PermissionEntity } from "core/entities/permission/permision";
import { AttributeInEntityEntity } from "core/entities/attributes/attribute-in-entity";

export class EditDocumentEntity extends BaseEntity {
  static build(parentGroupId: string | undefined, options?: { projectId?: string }) {
    return makeFnTransformableObject(() => new EditDocumentEntity({ parentGroupId, ...options }));
  }

  static buildFromDocument(document: DocumentEntity) {
    return makeFnTransformableObject(
      () => new EditDocumentEntity({ id: document.id }),
      () => ({
        name: document.name,
        description: document.description,
        type: document.type?.key ?? null,
        responsibleUser: document.responsibleUser?.id ?? null,
        responsibleUserFlow: document.responsibleUserFlow?.id ?? null,
        isPrivate: document.isPrivate,
        attributeValues: [...document.attributeValues],
        permissions: [...document.permissions],
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

  @observable type: string | null = null;
  setType = this.createSetter("type");

  @observable responsibleUser: string | null = null;
  setResponsibleUser = this.createSetter("responsibleUser");

  @observable responsibleUserFlow: string | null = null;
  setResponsibleUserFlow = this.createSetter("responsibleUserFlow");

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
      description: this.description === "" ? undefined : this.description,
      projectId: this.options.projectId,
      typeKey: this.type ?? undefined,
      responsibleUserId: this.responsibleUser ?? undefined,
      responsibleUserFlowId: this.responsibleUserFlow ?? undefined,
      isPrivate: this.isPrivate,
      attributes: this.attributesForApi,
    };
  }

  @computed get apiUpdateReady() {
    return {
      name: this.name,
      description: this.description,
      typeKey: this.type ?? undefined,
      responsibleUserId: this.responsibleUser,
      responsibleUserFlowId: this.responsibleUserFlow,
      isPrivate: this.isPrivate,
      attributes: this.attributesForApi,
    };
  }
}
