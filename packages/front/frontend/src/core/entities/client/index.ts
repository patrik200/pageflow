import { computed, observable } from "mobx";
import { Expose, Type } from "class-transformer";
import { arrayOfEntitiesDecoder, BaseEntity, withDefaultValue } from "@app/kit";
import { IsBoolean, IsDefined, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";

import { FileEntity } from "../file";

export class ClientStorageEntity extends BaseEntity {
  constructor() {
    super();
    this.initEntity();
  }

  @Expose() @IsDefined() @IsNumber() usedFileSize!: number;

  @Expose() @IsDefined() @IsNumber() filesMemoryLimit!: number;

  @Expose() @IsDefined() @IsBoolean() haveFilesMemoryLimit!: boolean;

  @computed get percentsOfUsedSize() {
    return this.usedFileSize / this.filesMemoryLimit;
  }
}

export class ClientNotificationEntity extends BaseEntity {
  constructor() {
    super();
    this.initEntity();
  }

  @Expose() @IsDefined() @IsString() text!: string;

  @Expose() @IsDefined() @IsString() type!: string;
}

export const arrayOfClientNotificationEntitiesDecoder = arrayOfEntitiesDecoder(ClientNotificationEntity);

export class ClientEntity extends BaseEntity {
  constructor() {
    super();
    this.initEntity();
  }

  @observable @Expose() @IsDefined() @IsString() id!: string;

  @observable @Expose() @IsDefined() @IsString() name!: string;

  @observable @Expose() @IsDefined() @IsString() domain!: string;

  @observable
  @Expose()
  @Type(() => FileEntity)
  @ValidateNested()
  @IsOptional()
  @withDefaultValue(null)
  logo!: FileEntity | null;

  @observable storage?: ClientStorageEntity;

  @observable notifications?: ClientNotificationEntity[];
}
