import { computed, observable } from "mobx";
import type { Sorting } from "@app/kit";
import { BaseEntity, createSortingForFieldGetter, createSortingSetter, makeTransformableObject } from "@app/kit";
import { DocumentSortingFields } from "@app/shared-enums";

import { DocumentGroupEntity } from "core/entities/document/group";
import { DocumentEntity } from "core/entities/document/document";
import { filterChangeSubscriber } from "core/entities/_utils/filterChangeSubscriber";
import { AttributeInEntityEntity } from "core/entities/attributes/attribute-in-entity";

import { EditDocumentGroupEntity } from "./EditGroup";

export class DocumentFilterEntity extends BaseEntity {
  static buildForDocument(document: DocumentEntity) {
    return makeTransformableObject(DocumentFilterEntity, () => ({
      _projectId: document.rootGroup!.project?.id,
      parentGroupId: document.parentGroup?.id ?? null,
    }));
  }

  static buildForProject(projectId: string | null) {
    return makeTransformableObject(DocumentFilterEntity, () => ({
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

  @observable type: string | null = null;
  setType = this.createSetter("type");

  @observable lastRevisionStatus: string | null = null;
  setLastRevisionStatus = this.createSetter("lastRevisionStatus");

  @observable sorting: Sorting<DocumentSortingFields> = undefined;
  getSortingForField = createSortingForFieldGetter<DocumentSortingFields>(this);
  setSorting = createSortingSetter<DocumentSortingFields>(this);

  @observable attributes: AttributeInEntityEntity[] = [];
  addAttribute = this.createPush("attributes");
  deleteAttributeByIndex = this.createDeleteByIndex("attributes");

  @observable author: string | null = null;
  setAuthor = this.createSetter("author");

  @observable responsible: string | null = null;
  setResponsible = this.createSetter("responsible");

  subscribeOnChange(callback: () => void) {
    return filterChangeSubscriber(
      {
        search: ["search"],
        parent: ["parentGroupId"],
        checkboxes: ["searchInRevisionAttachments", "showArchived"],
        selects: ["type", "lastRevisionStatus", "author", "responsible"],
        sorting: "sorting",
        attributes: ["attributes"],
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
      typeKey: this.type,
      lastRevisionStatus: this.lastRevisionStatus,
      sorting: this.sorting,
      attributes: this.attributes.map((attribute) => attribute.apiFindReady),
      author: this.author,
      responsibleUser: this.responsible,
    };
  }

  getCreateDocumentGroupEntity() {
    return EditDocumentGroupEntity.buildEmpty(this.parentGroupId ?? undefined, {
      projectId: this._projectId,
    });
  }

  getEditDocumentGroupEntity(group: DocumentGroupEntity) {
    return EditDocumentGroupEntity.buildFromDocumentGroup(group);
  }

  copy() {
    return makeTransformableObject(DocumentFilterEntity, () => ({
      _projectId: this._projectId,
      parentGroupId: this.parentGroupId,
      search: this.search,
      searchInRevisionAttachments: this.searchInRevisionAttachments,
      showArchived: this.showArchived,
      type: this.type,
      lastRevisionStatus: this.lastRevisionStatus,
    }));
  }
}
