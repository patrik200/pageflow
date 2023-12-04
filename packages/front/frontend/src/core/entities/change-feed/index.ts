import { Expose, Transform, Type } from "class-transformer";
import { arrayOfEntitiesDecoder, BaseEntity, IsDate } from "@app/kit";
import { IsDefined, IsString, ValidateNested } from "class-validator";

import { UserEntity } from "core/entities/user";

export class ChangeFeedEventEntity extends BaseEntity {
  constructor() {
    super();
    this.initEntity();
  }

  @Expose() @IsDefined() @IsDate() createdAt!: Date;

  @Expose() @IsDefined() @Type(() => UserEntity) @ValidateNested() author!: UserEntity;

  @Expose() @IsDefined() @IsString() eventType!: string;

  @Expose()
  @IsDefined()
  @Transform(({ value }) => JSON.parse(value), { toClassOnly: true })
  data!: Record<string, any>;
}

export const arrayOfChangeFeedEventEntities = arrayOfEntitiesDecoder(ChangeFeedEventEntity);
