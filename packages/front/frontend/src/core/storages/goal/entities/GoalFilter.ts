import { makeFnTransformableObject, BaseEntity } from "@app/kit";

export class GoalFilterEntity extends BaseEntity {
  static buildForProject(projectId: string) {
    return makeFnTransformableObject(() => new GoalFilterEntity(projectId));
  }

  constructor(public _projectId: string) {
    super();
    this.initEntity();
  }

  goalId: string | null = null;
  setGoalId = this.createSetter("goalId");
}
