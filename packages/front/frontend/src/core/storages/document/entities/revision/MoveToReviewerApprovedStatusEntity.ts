import { computed, observable } from "mobx";
import { BaseEntity, makeTransformableObject } from "@app/kit";
import { IsNotEmpty, ValidateIf } from "class-validator";

import { NOT_EMPTY_VALIDATION } from "core/commonValidationErrors";

export class MoveToReviewerApprovedStatusEntity extends BaseEntity {
  static buildEmpty() {
    return makeTransformableObject(MoveToReviewerApprovedStatusEntity);
  }

  constructor() {
    super();
    this.initEntity();
  }

  @observable hasComment = false;
  setHasComment = this.createSetter("hasComment");

  @observable
  @IsNotEmpty({ message: NOT_EMPTY_VALIDATION })
  @ValidateIf((entity: MoveToReviewerApprovedStatusEntity) => entity.hasComment)
  comment = "";
  setComment = this.createSetter("comment");

  @computed get apiReady() {
    return {
      comment: this.hasComment ? this.comment : undefined,
    };
  }
}
