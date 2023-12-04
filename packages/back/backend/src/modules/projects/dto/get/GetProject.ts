import { Expose } from "class-transformer";
import { IsOptional, IsString } from "class-validator";
import { IsBooleanConverter, IsSorting } from "@app/kit";
import { ProjectSortingFields } from "@app/shared-enums";

import { dtoMessageIsValidValue } from "constants/dtoErrorMessage";

import { ProjectSorting } from "../../types";

export class QueryGetProjectDTO {
  @Expose()
  @IsOptional()
  @IsString({ message: dtoMessageIsValidValue })
  search?: string;

  @Expose()
  @IsSorting(Object.values(ProjectSortingFields))
  sorting!: ProjectSorting;

  @Expose()
  @IsBooleanConverter()
  showArchived!: boolean;

  @Expose()
  @IsOptional()
  @IsString({ message: dtoMessageIsValidValue })
  responsibleUser?: string | null;
}
