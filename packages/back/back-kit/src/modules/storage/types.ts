export interface FileToSaveRawInterface {
  bucket: string;
  fileName?: string;
}

export type FileToSaveInterface = {
  id: string;
  fileName: string;
  size: number;
} & Omit<FileToSaveRawInterface, "fileName">;

export type FileBufferToSaveInterface = FileToSaveInterface & {
  buffer: Buffer;
};

export type FileStreamToSaveInterface = FileToSaveInterface & {
  stream: NodeJS.ReadableStream;
};
