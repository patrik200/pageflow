export enum DocumentRevisionStatus {
  INITIAL = "initial",
  REVIEW = "review",
  RETURNED = "returned",
  APPROVED = "approved",
  APPROVED_WITH_COMMENT = "approved_with_comment",
  REVOKED = "revoked",
  ARCHIVE = "archive",
  ARCHIVED_AUTOMATICALLY_RESTORE_INITIAL = "archived_automatically_restore_initial",
  ARCHIVED_AUTOMATICALLY_RESTORE_ARCHIVE = "archived_automatically_restore_archive",
}

export const DocumentRevisionActiveStatuses = [
  DocumentRevisionStatus.INITIAL,
  DocumentRevisionStatus.REVIEW,
  DocumentRevisionStatus.RETURNED,
  DocumentRevisionStatus.APPROVED,
  DocumentRevisionStatus.REVOKED,
];

export const DocumentRevisionArchivedStatuses = [
  DocumentRevisionStatus.ARCHIVE,
  DocumentRevisionStatus.ARCHIVED_AUTOMATICALLY_RESTORE_INITIAL,
  DocumentRevisionStatus.ARCHIVED_AUTOMATICALLY_RESTORE_ARCHIVE,
];

export const DocumentRevisionArchivedAutomaticallyStatuses = [
  DocumentRevisionStatus.ARCHIVED_AUTOMATICALLY_RESTORE_ARCHIVE,
  DocumentRevisionStatus.ARCHIVED_AUTOMATICALLY_RESTORE_INITIAL,
];

export const DocumentRevisionApprovingStatuses = [DocumentRevisionStatus.REVIEW, DocumentRevisionStatus.RETURNED];

export enum DocumentRevisionSortingFields {
  NUMBER = "number",
  CREATED_AT = "createdAt",
  STATUS = "status",
  AUTHOR = "author",
}
