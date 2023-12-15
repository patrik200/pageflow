import { action, observable } from "mobx";
import { Inject, Service } from "typedi";
import { InternalRequestManager, parseServerError, Storage } from "@app/front-kit";
import { emptyPaginatedEntities, METHODS } from "@app/kit";
import type { PaginatedEntities } from "@app/kit";

import { GoalEntity } from "core/entities/goal/goal";
import { DocumentGroupsAndDocumentsEntity } from "core/entities/document/documentGroupsAndDocuments";
import { IdEntity } from "core/entities/id";

import { IntlDateStorage } from "core/storages/intl-date";
import { EditGoalEntity } from "./entities/EditGoal";
import { GoalFilterEntity } from "./entities/GoalFilter";
import { EditTimepointEntity } from "./entities/EditTimepoint";

// import { DocumentFilterEntity } from "./entities/document/DocumentFilter";
// import { EditDocumentEntity } from "./entities/document/EditDocument";
// import { EditDocumentGroupEntity } from "./entities/document/EditGroup";


@Service()
export class GoalStorage extends Storage {
  static token = "GoalStorage";

  constructor() {
    super();
    this.initStorage(GoalStorage.token);
  }

  @Inject() private requestManager!: InternalRequestManager;
  @observable goalDetail: GoalEntity | null = null;
  @observable filter: GoalFilterEntity | null = null;
  // @observable goals!: ;

  @action initGoalFilter = (projectId: string) => {
    this.filter = GoalFilterEntity.buildForProject(projectId)
  }

  @action loadGoal = async (goalId: string) => {
    try {
      const goal = await this.requestManager.createRequest({
        url: "/goals/{goalId}",
        method: METHODS.GET,
        serverDataEntityDecoder: GoalEntity,
      })({ urlParams: { goalId } });

      this.goalDetail = goal;

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
    }
  

  @action updateGoal = async (id: string, entity: EditGoalEntity) => {
    try {
      await this.requestManager.createRequest({
        url: "/goals/{id}",
        method: METHODS.PATCH,
      })({ body: entity.apiReady, urlParams: {id} });
      
      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  }

  @action updateTimepoint = async (id: string, entity: EditTimepointEntity) => {
    try {
      await this.requestManager.createRequest({
        url: "/goals/timepoints/{id}/edit",
        method: METHODS.PATCH,
      })({ body: entity.apiReady, urlParams: {id} });
      
      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  }

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
  }
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
  }
}