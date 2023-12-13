import { computed, observable } from "mobx";
import { BaseEntity, makeFnTransformableObject, makeTransformableObject } from "@app/kit";
import { MinLength } from "class-validator";

import { NOT_EMPTY_VALIDATION } from "core/commonValidationErrors";

import { TimePointEntity } from "core/entities/goal/timepoint";

export class EditTimePointEntity extends BaseEntity {
  static buildEmpty(goalId: string) {
    return makeFnTransformableObject(() => new EditTimePointEntity({ _goalId: goalId }));
  }

  static buildFromTimePoint(timePoint: TimePointEntity) {
    return makeFnTransformableObject(
      () => new EditTimePointEntity({id: timePoint.id}),
      () => ({
        name: timePoint.name,
        description: timePoint.description,
        startDateFact: timePoint.startDateFact,
        startDatePlan: timePoint.startDatePlan
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


  @observable startDateFact: Date | null = null;
  setStartDateFact = this.createSetter("startDateFact");

  
  @observable startDatePlan!: Date;
  setStartDatePlan = this.createSetter("startDatePlan");

  @computed get apiReady() {
    return {
      name: this.name,
      description: this.description || undefined,
      startDateFact: this.startDateFact || undefined,
      startDatePlan: this.startDatePlan,
      goalId: this.options._goalId,
    };
  }
}
