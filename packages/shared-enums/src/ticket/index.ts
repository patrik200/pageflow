export enum TicketPriorities {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

export enum TicketRelationTypes {
  DEPENDENCY = "dependency",
  CHILDREN = "children",
  DUPLICATOR = "duplicator",
  RELATION = "relation",
}

export enum TicketSortingFields {
  NAME = "name",
  STATUS = "statusId",
  PRIORITY = "priority",
  DEADLINE_AT = "deadlineAt",
  CREATED_AT = "createdAt",
}
