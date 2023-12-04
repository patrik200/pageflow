export class DocumentResponsibleUserUpdated {
  static eventName = "document.responsibleUser.updated";

  constructor(public documentId: string, public responsibleUserId: string | null) {}
}
