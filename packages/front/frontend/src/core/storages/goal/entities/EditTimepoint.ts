import { computed, observable } from "mobx";
import { BaseEntity, makeFnTransformableObject, makeTransformableObject } from "@app/kit";
import { MinLength } from "class-validator";

import { NOT_EMPTY_VALIDATION } from "core/commonValidationErrors";

import { TimepointEntity } from "core/entities/goal/timepoint";

export class EditTimepointEntity extends BaseEntity {
  static buildEmpty(goalId: string) {
    return makeFnTransformableObject(() => new EditTimepointEntity({ _goalId: goalId }));
  }

  static buildFromTimepoint(timePoint: TimepointEntity) {
    return makeFnTransformableObject(
      () => new EditTimepointEntity({id: timePoint.id}),
      () => ({
        name: timePoint.name,
        description: timePoint.description,
        datePlan: timePoint.datePlan
      }),
    );
  }

  constructor(public options: { id?: string, _goalId?: string }) {
    super();
    this.initEntity();
  }

  @observable @MinLength(1, { message: NOT_EMPTY_VALIDATION }) name = "";
  setName = this.createSetter("name");

  @observable description = "";
  setDescription = this.createSetter("description");
  
  @observable datePlan!: Date;
  setDatePlan = this.createSetter("datePlan");

  @computed get apiReady() {
    return {
      name: this.name,
      description: this.description || undefined,
      datePlan: this.datePlan,
      goalId: this.options._goalId,
    };
  }
}
