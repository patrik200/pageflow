import { UserFlowEntity } from "entities/UserFlow";

export class DocumentResponsibleUserFlowUpdated {
  static eventName = "document.responsibleUserFlow.updated";

  constructor(public documentId: string, public responsibleUserFlow: UserFlowEntity | null) {}
}
