import { Expose, Type } from "class-transformer";
import { IsBoolean, IsDefined, IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";

import { Tariffs } from "fixtures/tariffs";

export class ResponseLandingTariffDTO {
  @Expose() @IsDefined() @IsString() name!: string;

  @Expose() @IsDefined() @IsBoolean() available!: boolean;

  @Expose() @IsDefined() @IsEnum(Tariffs) tariff!: Tariffs;

  @Expose() @IsOptional() @IsNumber() price!: number | null;
}

export class ResponseLandingTariffsListDTO {
  @Expose()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => ResponseLandingTariffDTO)
  list!: ResponseLandingTariffDTO[];
}
