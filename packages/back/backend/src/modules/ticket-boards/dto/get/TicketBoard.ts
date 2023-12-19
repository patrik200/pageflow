import { Expose, Type } from "class-transformer";
import { IsBoolean, IsDefined, IsOptional, IsString, ValidateNested } from "class-validator";

export class RequestGetTicketBoardsDTO {
  @Expose() @IsOptional() @IsString() projectId?: string | null;
}

export class ResponseTicketBoardDTO {
  @Expose() @IsDefined() @IsString() id!: string;

  @Expose() @IsDefined() @IsString() name!: string;

  @Expose() @IsDefined() @IsString() slug!: string;

  @Expose() @IsDefined() @IsBoolean() isPrivate!: boolean;

  @Expose() @IsDefined() @IsBoolean() favourite!: boolean;
}

export class ResponseTicketBoardsListDTO {
  @Expose()
  @IsDefined()
  @Type(() => ResponseTicketBoardDTO)
  @ValidateNested({ each: true })
  list!: ResponseTicketBoardDTO[];
}
