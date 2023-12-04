export enum CorrespondenceRevisionStatus {
  ACTIVE = "active",
  ARCHIVE = "archive",
  ARCHIVED_AUTOMATICALLY_RESTORE_ACTIVE = "archived_automatically_restore_active",
  ARCHIVED_AUTOMATICALLY_RESTORE_ARCHIVE = "archived_automatically_restore_archive",
}

export enum CorrespondenceRevisionSortingFields {
  NUMBER = "number",
  CREATED_AT = "createdAt",
  STATUS = "status",
  AUTHOR = "author",
}
