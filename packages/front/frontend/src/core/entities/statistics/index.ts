import { BaseEntity } from "@app/kit";
import { Expose } from "class-transformer";
import { IsDefined, IsNumber } from "class-validator";

export class StatisticsEntity extends BaseEntity {
  constructor() {
    super();
    this.initEntity();
  }

  @Expose() @IsDefined() @IsNumber() ticketsWhereIAmAnAuthor!: number;
  @Expose() @IsDefined() @IsNumber() ticketsWhereIAmAnCustomer!: number;
  @Expose() @IsDefined() @IsNumber() ticketsWhereIAmAnResponsible!: number;
  @Expose() @IsDefined() @IsNumber() projectWhereIAmAnResponsible!: number;
  @Expose() @IsDefined() @IsNumber() documentRevisionsWhereIAmAnResponsible!: number;
}
