import { BaseEntity, makeTransformableObject } from "@app/kit";
import { Expose, Type } from "class-transformer";
import { IsDefined, ValidateNested } from "class-validator";
import { IntlDate } from "@worksolutions/utils";
import { observable } from "mobx";

import { UserEntity } from "core/entities/user";

import { DocumentGroupEntity, MinimalDocumentGroupEntity } from "./group";
import { DocumentEntity } from "./document";

export class DocumentGroupsAndDocumentsEntity extends BaseEntity {
  static buildEmpty() {
    return makeTransformableObject(DocumentGroupsAndDocumentsEntity, () => ({
      groupsPath: [],
      documentGroups: [],
      documents: [],
    }));
  }

  constructor() {
    super();
    this.initEntity();
  }

  configure(intlDate: IntlDate, currentUser: UserEntity) {
    this.documents.forEach((document) => document.configure(intlDate, currentUser));
    this.documentGroups.forEach((group) => group.configure(intlDate, currentUser));
  }

  @observable
  @Expose()
  @IsDefined()
  @Type(() => MinimalDocumentGroupEntity)
  @ValidateNested({ each: true })
  groupsPath!: MinimalDocumentGroupEntity[];

  @Expose()
  @IsDefined()
  @Type(() => DocumentGroupEntity)
  @ValidateNested({ each: true })
  documentGroups!: DocumentGroupEntity[];

  @Expose()
  @IsDefined()
  @Type(() => DocumentEntity)
  @ValidateNested({ each: true })
  documents!: DocumentEntity[];
}
