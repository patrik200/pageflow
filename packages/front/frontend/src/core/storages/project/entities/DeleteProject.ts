import { BaseEntity, makeTransformableObject } from "@app/kit";
import { computed, observable } from "mobx";

export class DeleteProjectEntity extends BaseEntity {
  static buildEmpty() {
    return makeTransformableObject(DeleteProjectEntity);
  }

  constructor() {
    super();
    this.initEntity();
  }

  @observable moveDocumentsToAnotherProject = false;
  setMoveDocumentsToAnotherProject = this.createSetter("moveDocumentsToAnotherProject");

  @observable moveCorrespondencesToClient = false;
  setMoveCorrespondencesToClient = this.createSetter("moveCorrespondencesToClient");

  @computed get apiReady() {
    return {
      moveDocuments: this.moveDocumentsToAnotherProject,
      moveCorrespondencesToClient: this.moveCorrespondencesToClient,
    };
  }
}
