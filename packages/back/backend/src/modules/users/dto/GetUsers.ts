import { IsDefined, IsOptional, IsString, ValidateNested } from "class-validator";
import { Expose, Type } from "class-transformer";
import { IsSorting, IsBooleanConverter } from "@app/kit";
import { UserSortingFields } from "@app/shared-enums";

import { dtoMessageIsValidValue } from "constants/dtoErrorMessage";

import { ResponseProfileDTO } from "./Profile";
import type { UserSorting } from "../types";

export class RequestGetUsersDTO {
  @Expose() @IsOptional() @IsString({ message: dtoMessageIsValidValue }) search?: string;

  @Expose() @IsBooleanConverter() searchWithDeleted!: boolean;

  @Expose()
  @IsSorting(Object.values(UserSortingFields))
  sorting!: UserSorting;
}

export class ResponseGetUsersDTO {
  @Expose()
  @IsDefined()
  @Type(() => ResponseProfileDTO)
  @ValidateNested({ each: true })
  list!: ResponseProfileDTO[];
}
