import { computed, observable } from "mobx";
import type { Sorting } from "@app/kit";
import { BaseEntity, createSortingForFieldGetter, createSortingSetter, makeTransformableObject } from "@app/kit";
import { CorrespondenceSortingFields } from "@app/shared-enums";

import { CorrespondenceGroupEntity } from "core/entities/correspondence/group";
import { CorrespondenceEntity } from "core/entities/correspondence/correspondence";
import { filterChangeSubscriber } from "core/entities/_utils/filterChangeSubscriber";

import { EditCorrespondenceGroupEntity } from "./EditGroup";
import { AttributeInEntityEntity } from "../../../../entities/attributes/attribute-in-entity";

export class CorrespondenceFilterEntity extends BaseEntity {
  static buildEmpty() {
    return makeTransformableObject(CorrespondenceFilterEntity);
  }

  static buildForCorrespondence(correspondence: CorrespondenceEntity) {
    return makeTransformableObject(CorrespondenceFilterEntity, () => ({
      _projectId: correspondence.rootGroup!.project?.id,
      parentGroupId: correspondence.parentGroup?.id ?? null,
    }));
  }

  static buildForProject(projectId: string) {
    return makeTransformableObject(CorrespondenceFilterEntity, () => ({
      _projectId: projectId,
    }));
  }

  constructor() {
    super();
    this.initEntity();
    this.registerOnBuildCallback(() => {
      this.registerCustomOnFieldChangeCallback(() => this.setSearch(""), "parentGroupId", 0);
    });
  }

  _projectId?: string;

  @observable parentGroupId: string | null = null;
  setParentGroupId = this.createSetter("parentGroupId");

  @observable search = "";
  setSearch = this.createSetter("search");

  @observable searchInRevisionAttachments = false;
  setSearchInRevisionAttachments = this.createSetter("searchInRevisionAttachments");

  @observable showArchived = false;
  setShowArchived = this.createSetter("showArchived");

  @observable author: string | null = null;
  setAuthor = this.createSetter("author");

  @observable sorting: Sorting<CorrespondenceSortingFields> = undefined;
  getSortingForField = createSortingForFieldGetter<CorrespondenceSortingFields>(this);
  setSorting = createSortingSetter<CorrespondenceSortingFields>(this);

  @observable attributes: AttributeInEntityEntity[] = [];
  addAttribute = this.createPush("attributes");
  deleteAttributeByIndex = this.createDeleteByIndex("attributes");

  subscribeOnChange(callback: () => void) {
    return filterChangeSubscriber(
      {
        search: ["search"],
        parent: ["parentGroupId"],
        checkboxes: ["searchInRevisionAttachments", "showArchived"],
        selects: ["author"],
        attributes: ["attributes"],
        sorting: "sorting",
      },
      this,
      callback,
    );
  }

  @computed get apiReady() {
    return {
      parentGroupId: this.parentGroupId,
      search: this.search,
      searchInRevisionAttachments: this.searchInRevisionAttachments,
      projectId: this._projectId,
      showArchived: this.showArchived,
      sorting: this.sorting,
      attributes: this.attributes.map((attribute) => attribute.apiFindReady),
      author: this.author,
    };
  }

  getCreateCorrespondenceGroupEntity() {
    return EditCorrespondenceGroupEntity.buildEmptyForClient(this.parentGroupId ?? undefined, {
      projectId: this._projectId,
    });
  }

  getEditCorrespondenceGroupEntity(group: CorrespondenceGroupEntity) {
    return EditCorrespondenceGroupEntity.buildFromCorrespondenceGroup(group);
  }

  copy() {
    return makeTransformableObject(CorrespondenceFilterEntity, () => ({
      _projectId: this._projectId,
      parentGroupId: this.parentGroupId,
      search: this.search,
      searchInRevisionAttachments: this.searchInRevisionAttachments,
    }));
  }
}
