export class DocumentRevisionUserFlowDeadline {
  static eventName = "document.revision.userFlow.deadline";

  constructor(public revisionId: string) {}
}
