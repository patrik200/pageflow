import { computed, observable } from "mobx";

import { PermissionEntity } from "core/entities/permission/permision";
import { ChangeFeedEventEntity } from "core/entities/change-feed";

import { ProjectEntity } from "./project";

export class ProjectDetailEntity extends ProjectEntity {
  constructor() {
    super();
    this.initEntity();
  }

  @observable changeFeedEvents: ChangeFeedEventEntity[] = [];
  @observable permissions: PermissionEntity[] = [];

  @computed get resultCanEdit() {
    return PermissionEntity.hasPermissionToEditEntity(this.permissions, this.currentUser.id);
  }
}
