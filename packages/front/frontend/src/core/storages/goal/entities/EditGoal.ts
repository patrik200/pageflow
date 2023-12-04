import { computed, observable } from "mobx";
import { BaseEntity, makeFnTransformableObject, makeTransformableObject } from "@app/kit";
import { MinLength } from "class-validator";

import { NOT_EMPTY_VALIDATION } from "core/commonValidationErrors";

import { GoalEntity } from "core/entities/goal/goal";

export class EditGoalEntity extends BaseEntity {
  static buildEmpty(projectId: string) {
    return makeFnTransformableObject(() => new EditGoalEntity({ _projectId: projectId }));
  }

  static buildFromGoal(goal: GoalEntity) {
    return makeFnTransformableObject(
      () => new EditGoalEntity({id: goal.id}),
      () => ({
        name: goal.name,
        description: goal.description
      }),
    );
  }

  constructor(public options: { id?: string, _projectId?: string }) {
    super();
    this.initEntity();
  }

  @observable @MinLength(1, { message: NOT_EMPTY_VALIDATION }) name = "";
  setName = this.createSetter("name");

  @observable description = "";
  setDescription = this.createSetter("description");

  @computed get apiReady() {
    return {
      name: this.name,
      description: this.description || undefined,
      projectId: this.options._projectId,
    };
  }
}
