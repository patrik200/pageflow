export class DocumentRevisionApprovingDeadline {
  static eventName = "document.revision.approving-deadline";

  constructor(public revisionId: string) {}
}
