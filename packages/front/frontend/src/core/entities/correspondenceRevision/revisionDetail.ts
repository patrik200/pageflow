import { Expose, Type } from "class-transformer";
import { IsDefined, ValidateNested } from "class-validator";
import { withDefaultValue } from "@app/kit";
import { observable } from "mobx";

import { CorrespondenceEntity } from "core/entities/correspondence/correspondence";
import { FileEntity } from "core/entities/file";
import { ChangeFeedEventEntity } from "core/entities/change-feed";

import { CorrespondenceRevisionEntity } from "./revision";

export class CorrespondenceRevisionDetailEntity extends CorrespondenceRevisionEntity {
  constructor() {
    super();
    this.initEntity();
  }

  @Expose() @IsDefined() @Type(() => FileEntity) @ValidateNested({ each: true }) files!: FileEntity[];

  @Expose()
  @IsDefined()
  @Type(() => CorrespondenceEntity)
  @ValidateNested()
  @withDefaultValue(null)
  correspondence!: CorrespondenceEntity;

  @observable changeFeedEvents: ChangeFeedEventEntity[] = [];
}
