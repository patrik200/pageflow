import { Expose } from "class-transformer";
import { IsDefined } from "class-validator";
import { IsDate } from "@app/kit";

export class RequestProlongApprovingDeadlineDocumentRevisionDTO {
  @Expose() @IsDefined() @IsDate() approvingDeadline!: Date;
}
