import { action, observable } from "mobx";
import { Inject, Service } from "typedi";
import { InternalRequestManager, parseServerError, Storage } from "@app/front-kit";
import { METHODS } from "@app/kit";

import { arrayOfGoalsDecoder, GoalEntity } from "core/entities/goal/goal";
import { IdEntity } from "core/entities/id";

import { EditGoalEntity } from "./entities/EditGoal";
import { EditTimepointEntity } from "./entities/EditTimepoint";
import { IntlDateStorage } from "../intl-date";

@Service()
export class GoalStorage extends Storage {
  static token = "GoalStorage";

  constructor() {
    super();
    this.initStorage(GoalStorage.token);
  }

  @Inject() private requestManager!: InternalRequestManager;
  @Inject() private intlDateStorage!: IntlDateStorage;
  @observable goals!: GoalEntity[];

  @action loadGoals = async (projectId: string) => {
    try {
      const { array } = await this.requestManager.createRequest({
        url: "/goals/projects/{projectId}",
        method: METHODS.GET,
        responseDataFieldPath: ["list"],
        serverDataEntityDecoder: arrayOfGoalsDecoder,
      })({ urlParams: { projectId } });

      array.forEach((goal) =>
        goal.timepoints.forEach((timepoint) => timepoint.configure(this.intlDateStorage.getIntlDate())),
      );

      this.goals = array;

      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action loadGoal = async (goalId: string) => {
    try {
      const goal = await this.requestManager.createRequest({
        url: "/goals/{goalId}",
        method: METHODS.GET,
        serverDataEntityDecoder: GoalEntity,
      })({ urlParams: { goalId } });

      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action createGoal = async (entity: EditGoalEntity) => {
    try {
      const { id } = await this.requestManager.createRequest({
        url: "/goals/goal",
        method: METHODS.POST,
        serverDataEntityDecoder: IdEntity,
      })({ body: entity.apiReady });

      return { success: true, id } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action createTimepoint = async (entity: EditTimepointEntity) => {
    try {
      const { id } = await this.requestManager.createRequest({
        url: "/goals/timepoint",
        method: METHODS.POST,
        serverDataEntityDecoder: IdEntity,
      })({ body: entity.apiReady });

      return { success: true, id } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action updateGoal = async (id: string, entity: EditGoalEntity) => {
    try {
      await this.requestManager.createRequest({
        url: "/goals/{id}",
        method: METHODS.PATCH,
      })({ body: entity.apiReady, urlParams: { id } });

      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action updateTimepoint = async (id: string, entity: EditTimepointEntity) => {
    try {
      await this.requestManager.createRequest({
        url: "/goals/timepoints/{id}/edit",
        method: METHODS.PATCH,
      })({ body: entity.apiReady, urlParams: { id } });

      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action deleteGoal = async (goalId: string) => {
    try {
      await this.requestManager.createRequest({
        url: "/goals/{goalId}/delete",
        method: METHODS.DELETE,
      })({ urlParams: { goalId } });
      return { success: true } as const;
    } catch (error) {
      console.log(goalId)
      return { success: false, error: parseServerError(error) } as const;
    }
  };
  @action deleteTimepoint = async (timePointId: string) => {
    try {
      await this.requestManager.createRequest({
        url: "/goals/timepoints/{timePointId}/delete",
        method: METHODS.DELETE,
      })({ urlParams: { timePointId } });
      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };
}
