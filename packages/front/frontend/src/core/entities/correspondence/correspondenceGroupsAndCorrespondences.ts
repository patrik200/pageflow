import { BaseEntity, makeTransformableObject } from "@app/kit";
import { Expose, Type } from "class-transformer";
import { IsDefined, ValidateNested } from "class-validator";
import { IntlDate } from "@worksolutions/utils";
import { observable } from "mobx";

import { CorrespondenceGroupEntity, MinimalCorrespondenceGroupEntity } from "./group";
import { CorrespondenceEntity } from "./correspondence";
import { UserEntity } from "../user";

export class CorrespondenceGroupsAndCorrespondencesEntity extends BaseEntity {
  static buildEmpty() {
    return makeTransformableObject(CorrespondenceGroupsAndCorrespondencesEntity, () => ({
      groupsPath: [],
      correspondenceGroups: [],
      correspondences: [],
    }));
  }

  constructor() {
    super();
    this.initEntity();
  }

  configure(intlDate: IntlDate, currentUser: UserEntity) {
    this.correspondences.forEach((correspondence) => correspondence.configure(intlDate, currentUser));
    this.correspondenceGroups.forEach((group) => group.configure(intlDate, currentUser));
  }

  @observable
  @Expose()
  @IsDefined()
  @Type(() => MinimalCorrespondenceGroupEntity)
  @ValidateNested({ each: true })
  groupsPath!: MinimalCorrespondenceGroupEntity[];

  @Expose()
  @IsDefined()
  @Type(() => CorrespondenceGroupEntity)
  @ValidateNested({ each: true })
  correspondenceGroups!: CorrespondenceGroupEntity[];

  @Expose()
  @IsDefined()
  @Type(() => CorrespondenceEntity)
  @ValidateNested({ each: true })
  correspondences!: CorrespondenceEntity[];
}
