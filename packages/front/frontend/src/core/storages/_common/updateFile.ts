import { PromiseType } from "utility-types";

import { FileEntity, EditableFileEntity } from "core/entities/file";

export async function updateFileRequest(
  currentSavedFile: FileEntity | null,
  newFile: EditableFileEntity | null,
  requests: {
    deleteFile?: (id: string) => Promise<void | any>;
    uploadFile?: (body: FormData) => Promise<FileEntity>;
  },
) {
  if (newFile === null) {
    if (currentSavedFile === null) return { status: "ok" } as const;
    try {
      if (!requests.deleteFile) throw new Error("Bad state");
      await requests.deleteFile(currentSavedFile.id);
      return { status: "ok", cause: "delete", deletableFile: currentSavedFile } as const;
    } catch (e) {
      return { status: "delete-error", deletableFile: currentSavedFile } as const;
    }
  }

  if (FileEntity.isFileEntity(newFile.entity)) return { status: "ok" } as const;

  try {
    if (!requests.uploadFile) throw new Error("Bad state");
    const body = new FormData();
    body.append("file", newFile.entity.rawFile);
    const fileEntity = await requests.uploadFile(body);
    return { status: "ok", cause: "upload", uploadableFile: newFile, file: fileEntity } as const;
  } catch (e) {
    return { status: "upload-error", uploadableFile: newFile } as const;
  }
}

export type UpdateFileRequestResult = PromiseType<ReturnType<typeof updateFileRequest>>;

export async function updateFileArrayRequest(
  currentSavedFiles: FileEntity[],
  newFiles: EditableFileEntity[],
  requests: {
    deleteFile?: (id: string, file: FileEntity) => Promise<void | any>;
    uploadFile?: (body: FormData, file: EditableFileEntity) => Promise<FileEntity>;
  },
) {
  const filesToUpload = newFiles.filter(
    (newFile) => !currentSavedFiles.find((currentFile) => currentFile.id === newFile.id),
  );

  const filesToDelete = currentSavedFiles.filter(
    (currentFile) => !newFiles.find((newFile) => newFile.id === currentFile.id),
  );

  const uploadResults = await Promise.all(
    filesToUpload.map((file) =>
      updateFileRequest(null, file, {
        uploadFile: requests.uploadFile ? (body) => requests.uploadFile!(body, file) : undefined,
      }),
    ),
  );
  const deleteResults = await Promise.all(
    filesToDelete.map((file) =>
      updateFileRequest(file, null, {
        deleteFile: requests.deleteFile ? (id) => requests.deleteFile!(id, file) : undefined,
      }),
    ),
  );

  return { uploadResults, deleteResults };
}
