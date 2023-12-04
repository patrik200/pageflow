import { BaseEntity, makeFnTransformableObject, MinDateValidation } from "@app/kit";
import { computed, observable } from "mobx";
import { MinLength } from "class-validator";

import { END_DATE_SHOULD_BE_AFTER_START_DATE, NOT_EMPTY_VALIDATION } from "core/commonValidationErrors";

import { ProjectDetailEntity } from "core/entities/project/projectDetail";
import { EditableFileEntity } from "core/entities/file";
import { PermissionEntity } from "core/entities/permission/permision";

export class EditProjectEntity extends BaseEntity {
  static buildEmpty() {
    return makeFnTransformableObject(() => new EditProjectEntity(null));
  }

  static buildFromProjectEntity(project: ProjectDetailEntity) {
    return makeFnTransformableObject(
      () => new EditProjectEntity(project),
      () => ({
        isPrivate: project.isPrivate,
        name: project.name,
        description: project.description,
        preview: project.preview?.toEditableFileEntity(),
        startDatePlan: project.startDatePlan,
        startDateForecast: project.startDateForecast,
        startDateFact: project.startDateFact,
        endDatePlan: project.endDatePlan,
        endDateForecast: project.endDateForecast,
        endDateFact: project.endDateFact,
        notifyInDays: project.notifyInDays === null ? "" : project.notifyInDays.toString(),
        responsible: project.responsible?.id ?? null,
        permissions: [...project.permissions],
      }),
    );
  }

  constructor(public project: ProjectDetailEntity | null) {
    super();
    this.initEntity();
  }

  @observable isPrivate = false;
  setIsPrivate = this.createSetter("isPrivate");

  @observable @MinLength(1, { message: NOT_EMPTY_VALIDATION }) name = "";
  setName = this.createSetter("name");

  @observable description = "";
  setDescription = this.createSetter("description");

  @observable preview: EditableFileEntity | null = null;
  setPreview = this.createSetter("preview");

  @observable startDatePlan: Date | null = null;
  setStartDatePlan = this.createSetter("startDatePlan");

  @observable
  @MinDateValidation("startDatePlan", { message: END_DATE_SHOULD_BE_AFTER_START_DATE })
  endDatePlan: Date | null = null;
  setEndDatePlan = this.createSetter("endDatePlan");

  @observable startDateForecast: Date | null = null;
  setStartDateForecast = this.createSetter("startDateForecast");

  @observable
  @MinDateValidation("startDateForecast", { message: END_DATE_SHOULD_BE_AFTER_START_DATE })
  endDateForecast: Date | null = null;
  setEndDateForecast = this.createSetter("endDateForecast");

  @observable startDateFact: Date | null = null;
  setStartDateFact = this.createSetter("startDateFact");

  @observable
  @MinDateValidation("startDateFact", { message: END_DATE_SHOULD_BE_AFTER_START_DATE })
  endDateFact: Date | null = null;
  setEndDateFact = this.createSetter("endDateFact");

  @observable responsible: string | null = null;
  setResponsible = this.createSetter("responsible");

  @observable notifyInDays = "";
  setNotifyInDays = this.createSetter("notifyInDays");

  @observable permissions: PermissionEntity[] = [];

  @computed get apiReady() {
    return {
      isPrivate: this.isPrivate,
      name: this.name,
      description: this.description,
      responsibleId: this.responsible,
      startDatePlan: this.startDatePlan,
      startDateForecast: this.startDateForecast,
      startDateFact: this.startDateFact,
      endDatePlan: this.endDatePlan,
      endDateForecast: this.endDateForecast,
      endDateFact: this.endDateFact,
      notifyInDays: this.notifyInDays === "" ? null : parseInt(this.notifyInDays),
    };
  }
}
