import { BaseGeneratedIDEntity } from "@app/back-kit";
import { AfterLoad, Column, Entity, ManyToOne, OneToMany, Repository } from "typeorm";

import { UserEntity } from "entities/User";
import { ClientEntity } from "entities/Client";
import { PermissionEntity } from "entities/Permission";

import { CorrespondenceRootGroupEntity } from "./rootGroup";
import { CorrespondenceGroupFavouriteEntity } from "./Favourite";
import { CorrespondenceEntity } from "../Correspondence";

@Entity({ name: "correspondence_groups" })
export class CorrespondenceGroupEntity extends BaseGeneratedIDEntity {
  @ManyToOne(() => ClientEntity, { onDelete: "CASCADE", nullable: false })
  client!: ClientEntity;

  @ManyToOne(() => UserEntity, { onDelete: "CASCADE", nullable: false })
  author!: UserEntity;

  @Column()
  name!: string;

  @Column({ type: "text", nullable: true })
  description!: string | null;

  @ManyToOne(() => CorrespondenceRootGroupEntity, (group) => group.allChildrenGroups, { nullable: false })
  rootGroup!: CorrespondenceRootGroupEntity;

  @ManyToOne(() => CorrespondenceGroupEntity, { nullable: true })
  parentGroup!: CorrespondenceGroupEntity | null;

  @OneToMany(() => CorrespondenceGroupEntity, (group) => group.parentGroup)
  childrenGroups!: CorrespondenceGroupEntity[];

  @OneToMany(() => CorrespondenceEntity, (correspondence) => correspondence.parentGroup)
  childrenCorrespondences!: CorrespondenceEntity[];

  @OneToMany(() => CorrespondenceGroupFavouriteEntity, (favourite) => favourite.group)
  favourites!: CorrespondenceGroupFavouriteEntity[];

  @Column({ type: "text", default: "[]" }) _path!: string;

  @Column({ default: false })
  isPrivate!: boolean;

  path!: string[];

  @AfterLoad()
  private decodePath() {
    if (this._path) this.path = JSON.parse(this._path);
  }

  async recalculatePathAndSave(repository: Repository<CorrespondenceGroupEntity>) {
    this.path = [this.id];
    let currentGroupLink: CorrespondenceGroupEntity = this as CorrespondenceGroupEntity;

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

  groupsPath?: CorrespondenceGroupEntity[];

  async calculateGroupsPath(repository: Repository<CorrespondenceGroupEntity>) {
    this.groupsPath = await Promise.all(this.path.map((id) => repository.findOneOrFail({ where: { id } })));
  }

  // virtual fields -----

  favourite?: boolean;

  permissions?: PermissionEntity[];
}
