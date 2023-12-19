import { BaseEntity, makeFnTransformableObject, makeTransformableObject } from "@app/kit";
import { action, computed, observable } from "mobx";
import { MinLength } from "class-validator";
import { slugify } from "transliteration";
import { Expose } from "class-transformer";

import { NOT_EMPTY_VALIDATION } from "core/commonValidationErrors";

import { TicketBoardEntity } from "core/entities/ticket/ticketBoard";
import { PermissionEntity } from "core/entities/permission/permision";

export class EditTicketBoardEntity extends BaseEntity {
  static MAX_SLUG_LENGTH = 16;

  static buildEmpty(projectId?: string) {
    return makeFnTransformableObject(() => new EditTicketBoardEntity(true, { projectId }));
  }

  static buildFromTicketBoardEntity(entity: TicketBoardEntity) {
    return makeFnTransformableObject(
      () => new EditTicketBoardEntity(false, { id: entity.id }),
      () => ({
        isPrivate: entity.isPrivate,
        name: entity.name,
        slug: entity.slug,
      }),
    );
  }

  constructor(enableAutoSlugify: boolean, private options?: { projectId?: string; id?: string }) {
    super();
    this.initEntity();
    this.registerOnBuildCallback(() => {
      if (enableAutoSlugify) this.registerCustomOnFieldChangeCallback(() => this.runAutoSlugifyOnName(), "name", 0);
    });
  }

  @action private runAutoSlugifyOnName = () => {
    const slug = slugify(this.name, {
      uppercase: true,
      trim: true,
      unknown: "",
      separator: "",
      allowedChars: "a-zA-Zа-яА-Я",
    });
    this.setSlug(slug.slice(0, EditTicketBoardEntity.MAX_SLUG_LENGTH));
  };

  @observable isPrivate = false;
  setIsPrivate = this.createSetter("isPrivate");

  @observable @MinLength(1, { message: NOT_EMPTY_VALIDATION }) name = "";
  setName = this.createSetter("name");

  @observable @Expose() @MinLength(1, { message: NOT_EMPTY_VALIDATION }) slug = "";
  setSlug = this.createSetter("slug");

  @computed get apiCreateReady() {
    return {
      name: this.name,
      slug: this.slug,
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
