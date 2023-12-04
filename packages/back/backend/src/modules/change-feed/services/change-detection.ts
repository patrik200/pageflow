import { Injectable } from "@nestjs/common";

import { DictionaryValueEntity } from "entities/Dictionary/Dictionary";
import { PermissionEntity } from "entities/Permission";

@Injectable()
export class ChangeFeedEventChangeDetectionService {
  change(newValue: any, oldValue: any) {
    return String(newValue) === String(oldValue) ? undefined : { from: oldValue, to: newValue };
  }

  createEntityChange<ENTITY extends {}, FIELD_NAME extends keyof ENTITY, WRITABLE_FIELD_NAME extends keyof ENTITY>(
    newEntity: ENTITY | null | undefined,
    oldEntity: ENTITY | null | undefined,
    fieldName: FIELD_NAME,
    writableFieldName: WRITABLE_FIELD_NAME,
  ) {
    if (newEntity === undefined || oldEntity === undefined) return undefined;

    if (newEntity) {
      if (oldEntity) {
        if (oldEntity[fieldName] === newEntity[fieldName]) return undefined;
        return { from: oldEntity[writableFieldName], to: newEntity[writableFieldName] };
      }
      return { from: null, to: newEntity[writableFieldName] };
    }
    if (oldEntity) return { from: oldEntity[writableFieldName], to: null };
    return undefined;
  }

  changeForFile(
    newFile: { id: string; fileName: string } | null | undefined,
    oldFile: { id: string; fileName: string } | null | undefined,
  ) {
    return this.createEntityChange(newFile, oldFile, "id", "fileName");
  }

  changeForFilesList(
    newFiles: { id: string; file: { fileName: string } }[] | undefined,
    oldFiles: { id: string; file: { fileName: string } }[] | undefined,
  ) {
    if (newFiles === undefined || oldFiles === undefined) return undefined;

    const removedFiles = oldFiles.filter((oldFile) => !newFiles.find((newFile) => newFile.id === oldFile.id));
    const addedFiles = newFiles.filter((newFile) => !oldFiles.find((oldFile) => oldFile.id === newFile.id));

    if (removedFiles.length === 0 && addedFiles.length === 0) return undefined;

    if (removedFiles.length !== 0)
      return {
        from: removedFiles.map(({ file }) => file.fileName),
        to: null,
      };

    return {
      from: null,
      to: addedFiles.map(({ file }) => file.fileName),
    };
  }

  changeForEntity(newEntity: { id: string } | null | undefined, oldEntity: { id: string } | null | undefined) {
    return this.createEntityChange(newEntity, oldEntity, "id", "id");
  }

  changeForDictionary(
    newEntity: DictionaryValueEntity | null | undefined,
    oldEntity: DictionaryValueEntity | null | undefined,
  ) {
    return this.createEntityChange(newEntity, oldEntity, "key", "key");
  }

  private permissionsSame(permission1: PermissionEntity, permission2: PermissionEntity) {
    return (
      permission1.user.id === permission2.user.id &&
      permission1.role === permission2.role &&
      permission1.canEditReaderPermissions === permission2.canEditReaderPermissions &&
      permission1.canEditEditorPermissions === permission2.canEditEditorPermissions
    );
  }

  changeForPermissions(newPermissions: PermissionEntity[] | undefined, oldPermissions: PermissionEntity[] | undefined) {
    if (newPermissions === undefined || oldPermissions === undefined) return undefined;

    const results = new Map<string, { from: PermissionEntity | null; to: PermissionEntity | null }>();

    newPermissions.forEach((newPermission) => {
      const oldPermission = oldPermissions.find((oldPermission) => oldPermission.id === newPermission.id);
      if (oldPermission) {
        if (this.permissionsSame(newPermission, oldPermission)) return;
        results.set(newPermission.user.id, { from: oldPermission, to: newPermission });
        return;
      }

      results.set(newPermission.user.id, { from: null, to: newPermission });
    });

    oldPermissions.forEach((oldPermission) => {
      const newPermission = newPermissions.find((newPermission) => newPermission.id === oldPermission.id);
      if (newPermission) return;
      results.set(oldPermission.user.id, { from: oldPermission, to: null });
    });

    if (results.size === 0) return undefined;

    return {
      from: null,
      to: [...results.entries()].map(([userId, { from, to }]) => ({
        userId,
        from: from
          ? {
              role: from.role,
              canEditReaderPermissions: from.canEditReaderPermissions,
              canEditEditorPermissions: from.canEditEditorPermissions,
            }
          : null,
        to: to
          ? {
              role: to.role,
              canEditReaderPermissions: to.canEditReaderPermissions,
              canEditEditorPermissions: to.canEditEditorPermissions,
            }
          : null,
      })),
    };
  }
}
