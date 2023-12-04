import { computed, observable } from "mobx";
import { BaseEntity, makeFnTransformableObject } from "@app/kit";
import { MinLength } from "class-validator";

import { NOT_EMPTY_VALIDATION } from "core/commonValidationErrors";

import { DocumentGroupEntity } from "core/entities/document/group";

import { PermissionEntity } from "../../../../entities/permission/permision";

export class EditDocumentGroupEntity extends BaseEntity {
  static buildEmpty(parentGroupId: string | undefined, options?: { projectId?: string }) {
    return makeFnTransformableObject(() => new EditDocumentGroupEntity({ parentGroupId, ...options }));
  }

  static buildFromDocumentGroup(group: DocumentGroupEntity) {
    return makeFnTransformableObject(
      () => new EditDocumentGroupEntity({ id: group.id }),
      () => ({
        name: group.name,
        description: group.description,
        isPrivate: group.isPrivate,
        permissions: [...group.permissions],
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

  @observable permissions: PermissionEntity[] = [];

  @computed get apiCreateReady() {
    return {
      parentGroupId: this.options.parentGroupId,
      name: this.name,
      description: this.description || undefined,
      projectId: this.options.projectId,
      isPrivate: this.isPrivate,
    };
  }

  @computed get apiUpdateReady() {
    return {
      name: this.name,
      description: this.description,
      isPrivate: this.isPrivate,
    };
  }

  get isEdit() {
    return !!this.options.id;
  }
}
