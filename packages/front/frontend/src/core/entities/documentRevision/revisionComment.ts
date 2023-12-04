import { arrayOfEntitiesDecoder, BaseEntity, IsDate } from "@app/kit";
import { Expose, Type } from "class-transformer";
import { IsBoolean, IsDefined, IsString, ValidateNested } from "class-validator";
import { DateTime } from "luxon";
import { computed, observable } from "mobx";

import { UserEntity } from "core/entities/user";
import { FileEntity } from "core/entities/file";

import { DocumentRevisionCommentDiscussionEntity } from "./revisionCommentDiscussion";

export class DocumentRevisionCommentEntity extends BaseEntity {
  constructor() {
    super();
    this.initEntity();
  }

  @Expose() @IsDefined() @IsString() id!: string;

  @Expose() @IsDefined() @IsString() text!: string;

  @Expose() @IsDefined() @IsBoolean() updated!: boolean;

  @Expose() @IsDefined() @IsBoolean() canUpdate!: boolean;

  @Expose() @IsDefined() @Type(() => UserEntity) @ValidateNested() author!: UserEntity;

  @Expose() @IsDefined() @Type(() => FileEntity) @ValidateNested({ each: true }) files!: FileEntity[];

  @Expose() @IsDefined() @IsDate() createdAt!: Date;

  @Expose() @IsDefined() @IsDate() updatedAt!: Date;

  @observable @Expose() @IsDefined() @IsBoolean() resolved!: boolean;
  setResolved = this.createSetter("resolved");

  @observable @Expose() @IsDefined() @IsBoolean() canResolve!: boolean;
  setCanResolve = this.createSetter("canResolve");

  @computed get viewCreatedAtDateTime() {
    return DateTime.fromJSDate(this.createdAt);
  }

  @observable discussions: DocumentRevisionCommentDiscussionEntity[] = [];
  setDiscussions = this.createSetter("discussions");
  addDiscussion = this.createPush("discussions");
  updateDiscussionByIndex = this.createUpdateByIndex("discussions");
  deleteDiscussionByIndex = this.createDeleteByIndex("discussions");
}

export const arrayOfDocumentRevisionCommentEntitiesDecoder = arrayOfEntitiesDecoder(DocumentRevisionCommentEntity);
