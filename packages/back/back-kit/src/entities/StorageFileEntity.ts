import { Column, Entity, ManyToOne, OneToMany } from "typeorm";

import { BaseIDEntity } from "./BaseEntity";

@Entity({ name: "storage_files" })
export class StorageFileEntity extends BaseIDEntity {
  @Column() bucket!: string;

  @Column() fileName!: string;

  @Column() size!: number;

  @Column({ default: false }) public!: boolean;

  @ManyToOne(() => StorageFileEntity, (file) => file.childVariants, { nullable: true })
  parentFile!: StorageFileEntity | null;

  @OneToMany(() => StorageFileEntity, (file) => file.parentFile)
  childVariants!: StorageFileEntity[];
}
