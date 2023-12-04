import { action, computed, observable } from "mobx";
import { BaseEntity, cachedProperty, makeFnTransformableObject } from "@app/kit";
import { Expose } from "class-transformer";
import { IsDefined, IsNumber, IsString } from "class-validator";
import { FileInterface } from "@worksolutions/utils";
import uuid from "uuidjs";

export class FileEntity extends BaseEntity {
  static isFileEntity(obj: FileEntity | EditableFileEntity | FileInterface): obj is FileEntity {
    return obj instanceof FileEntity;
  }

  constructor() {
    super();
    this.initEntity();
  }

  @observable @Expose() @IsDefined() @IsString() id!: string;

  @observable @Expose() @IsDefined() @IsString() bucket!: string;

  @observable @Expose() @IsDefined() @IsString() fileName!: string;

  @observable @Expose() @IsDefined() @IsNumber() size!: number;

  @computed get url() {
    const path = `/api/storage/files/${this.bucket}/${this.id}`;
    if (process.env.NODE_ENV === "development") return `http://localhost:8000${path}`;
    return path;
  }

  @computed get urlWidth100() {
    return this.url + "?width=100";
  }

  toEditableFileEntity() {
    return EditableFileEntity.build(this);
  }
}

// noinspection JSPrimitiveTypeWrapperUsage
export class EditableFileEntity extends BaseEntity {
  static isEditableFileEntity(obj: FileEntity | EditableFileEntity | FileInterface): obj is EditableFileEntity {
    return obj instanceof EditableFileEntity;
  }

  static buildFileInterfaceFromFile(file: File): FileInterface {
    return { size: file.size, path: "", name: file.name, rawFile: file };
  }

  static build(entity: FileEntity | FileInterface) {
    return makeFnTransformableObject(() => new EditableFileEntity(entity));
  }

  constructor(public entity: FileEntity | FileInterface) {
    super();
    this.initEntity();
    this.disableEnumerableForMobx("entity");
  }

  @observable progress: undefined | number;
  @action setProgress = (progress: number | undefined) => (this.progress = progress);

  @cachedProperty(-1)
  getTempId() {
    return uuid.generate();
  }

  @computed get id() {
    if (FileEntity.isFileEntity(this.entity)) return this.entity.id;
    return this.getTempId();
  }

  @computed get url(): string & { dispose?: () => void } {
    if (FileEntity.isFileEntity(this.entity)) return this.entity.url;
    const objectUrl = URL.createObjectURL(this.entity.rawFile) + "#" + this.id;
    // eslint-disable-next-line no-new-wrappers
    const url: string & { dispose?: () => void } = new String(objectUrl) as string;
    url.dispose = () => URL.revokeObjectURL(objectUrl);
    return url;
  }

  @computed get fileName() {
    if (FileEntity.isFileEntity(this.entity)) return this.entity.fileName;
    return this.entity.name;
  }

  @computed get size() {
    if (FileEntity.isFileEntity(this.entity)) return this.entity.size;
    return this.entity.size;
  }
}
