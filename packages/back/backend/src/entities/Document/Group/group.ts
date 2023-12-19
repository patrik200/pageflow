import { BaseGeneratedIDEntity } from "@app/back-kit";
import { AfterLoad, Column, Entity, ManyToOne, OneToMany, Repository } from "typeorm";

import { ClientEntity } from "entities/Client";
import { UserEntity } from "entities/User";
import { PermissionEntity } from "entities/Permission";

import { DocumentEntity } from "../Document";
import { DocumentGroupFavouriteEntity } from "./Favourite";
import { DocumentRootGroupEntity } from "./rootGroup";

@Entity({ name: "document_groups" })
export class DocumentGroupEntity extends BaseGeneratedIDEntity {
  @ManyToOne(() => ClientEntity, { onDelete: "CASCADE", nullable: false })
  client!: ClientEntity;

  @ManyToOne(() => UserEntity, { onDelete: "CASCADE", nullable: false })
  author!: UserEntity;

  @Column()
  name!: string;

  @Column({ type: "text", nullable: true })
  description!: string | null;

  @ManyToOne(() => DocumentRootGroupEntity, (group) => group.allChildrenGroups, { nullable: false })
  rootGroup!: DocumentRootGroupEntity;

  @ManyToOne(() => DocumentGroupEntity, { nullable: true })
  parentGroup!: DocumentGroupEntity | null;

  @OneToMany(() => DocumentGroupEntity, (group) => group.parentGroup)
  childrenGroups!: DocumentGroupEntity[];

  @OneToMany(() => DocumentEntity, (document) => document.parentGroup)
  childrenDocuments!: DocumentEntity[];

  @OneToMany(() => DocumentGroupFavouriteEntity, (favourite) => favourite.group)
  favourites!: DocumentGroupFavouriteEntity[];

  @Column({ type: "text", default: "[]" }) _path!: string;

  @Column({ default: false })
  isPrivate!: boolean;

  path!: string[];

  @AfterLoad()
  private decodePath() {
    if (this._path) this.path = JSON.parse(this._path);
  }

  async recalculatePathAndSave(repository: Repository<DocumentGroupEntity>) {
    this.path = [this.id];
    let currentGroupLink: DocumentGroupEntity = this as DocumentGroupEntity;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const group = await repository.findOneOrFail({
        where: { id: currentGroupLink.id },
        relations: { parentGroup: true },
      });
      if (!group.parentGroup) break;
      this.path.splice(0, 0, group.parentGroup.id);
      currentGroupLink = group.parentGroup;
    }

    await repository.save({ id: this.id, _path: JSON.stringify(this.path) });
  }

  groupsPath?: DocumentGroupEntity[];

  async calculateGroupsPath(repository: Repository<DocumentGroupEntity>) {
    this.groupsPath = await Promise.all(this.path.map((id) => repository.findOneOrFail({ where: { id } })));
  }

  // virtual fields -------

  favourite?: boolean;

  permissions?: PermissionEntity[];
}
