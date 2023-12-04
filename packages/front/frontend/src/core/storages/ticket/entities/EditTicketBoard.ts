import { BaseEntity, makeFnTransformableObject, makeTransformableObject } from "@app/kit";
import { computed, observable } from "mobx";
import { MinLength } from "class-validator";

import { NOT_EMPTY_VALIDATION } from "core/commonValidationErrors";

import { TicketBoardEntity } from "core/entities/ticket/ticketBoard";
import { PermissionEntity } from "core/entities/permission/permision";

export class EditTicketBoardEntity extends BaseEntity {
  static buildEmpty(projectId?: string) {
    return makeFnTransformableObject(() => new EditTicketBoardEntity({ projectId }));
  }

  static buildFromTicketBoardEntity(entity: TicketBoardEntity) {
    return makeFnTransformableObject(
      () => new EditTicketBoardEntity({ id: entity.id }),
      () => ({
        isPrivate: entity.isPrivate,
        name: entity.name,
      }),
    );
  }

  constructor(private options?: { projectId?: string; id?: string }) {
    super();
    this.initEntity();
  }

  @observable isPrivate = false;
  setIsPrivate = this.createSetter("isPrivate");

  @observable @MinLength(1, { message: NOT_EMPTY_VALIDATION }) name = "";
  setName = this.createSetter("name");

  @computed get apiCreateReady() {
    return {
      name: this.name,
      isPrivate: this.isPrivate,
      projectId: this.options!.projectId!,
    };
  }

  @computed get apiUpdateReady() {
    return {
      body: {
        name: this.name,
        isPrivate: this.isPrivate,
      },
      url: {
        id: this.options!.id!,
      },
    };
  }

  createTicketBoardEntity(permissions: PermissionEntity[], id?: string) {
    return makeTransformableObject(TicketBoardEntity, () => ({
      id: this.options?.id ?? id,
      name: this.name,
      isPrivate: this.isPrivate,
      favourite: false,
      permissions,
    }));
  }
}
