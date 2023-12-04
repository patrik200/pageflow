import { arrayOfEntitiesDecoder, BaseEntity, IsDate } from "@app/kit";
import { Expose, Type } from "class-transformer";
import { IsBoolean, IsDefined, IsString, ValidateNested } from "class-validator";
import { DateTime } from "luxon";
import { computed } from "mobx";

import { UserEntity } from "core/entities/user";
import { FileEntity } from "core/entities/file";

export class DocumentRevisionCommentDiscussionEntity extends BaseEntity {
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

  @computed get viewCreatedAtDateTime() {
    return DateTime.fromJSDate(this.createdAt);
  }
}

export const arrayOfDocumentRevisionCommentDiscussionEntitiesDecoder = arrayOfEntitiesDecoder(
  DocumentRevisionCommentDiscussionEntity,
);
