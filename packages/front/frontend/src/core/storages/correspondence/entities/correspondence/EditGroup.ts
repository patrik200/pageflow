import { computed, observable } from "mobx";
import { BaseEntity, makeFnTransformableObject } from "@app/kit";
import { MinLength } from "class-validator";

import { NOT_EMPTY_VALIDATION } from "core/commonValidationErrors";

import { CorrespondenceGroupEntity } from "core/entities/correspondence/group";

import { PermissionEntity } from "../../../../entities/permission/permision";

export class EditCorrespondenceGroupEntity extends BaseEntity {
  static buildEmptyForClient(parentGroupId: string | undefined, options?: { projectId?: string }) {
    return makeFnTransformableObject(() => new EditCorrespondenceGroupEntity({ parentGroupId, ...options }));
  }

  static buildFromCorrespondenceGroup(group: CorrespondenceGroupEntity) {
    return makeFnTransformableObject(
      () => new EditCorrespondenceGroupEntity({ id: group.id }),
      () => ({
        isPrivate: group.isPrivate,
        name: group.name,
        description: group.description,
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
