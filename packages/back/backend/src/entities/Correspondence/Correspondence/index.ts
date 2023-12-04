import { BaseGeneratedIDEntity } from "@app/back-kit";
import { CorrespondenceStatus, UserRole } from "@app/shared-enums";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany } from "typeorm";

import { ClientEntity } from "entities/Client";
import { ContractorEntity } from "entities/Contractor";
import { DocumentEntity } from "entities/Document/Document";
import { UserEntity } from "entities/User";
import { PermissionEntity } from "entities/Permission";
import { AttributeValueEntity } from "entities/Attribute/value";

import { CorrespondenceGroupEntity } from "../Group/group";
import { CorrespondenceRootGroupEntity } from "../Group/rootGroup";
import { CorrespondenceFavouriteEntity } from "./Favourite";
import { CorrespondenceRevisionEntity } from "./Revision";

@Entity({ name: "correspondences" })
export class CorrespondenceEntity extends BaseGeneratedIDEntity {
  @ManyToOne(() => ClientEntity, { onDelete: "CASCADE", nullable: false })
  client!: ClientEntity;

  @ManyToOne(() => CorrespondenceRootGroupEntity, (group) => group.allChildrenCorrespondences, { nullable: false })
  rootGroup!: CorrespondenceRootGroupEntity;

  @ManyToOne(() => CorrespondenceGroupEntity, (group) => group.childrenCorrespondences, { nullable: true })
  parentGroup!: CorrespondenceGroupEntity | null;

  @ManyToOne(() => UserEntity, { onDelete: "CASCADE", nullable: false })
  author!: UserEntity;

  @Column()
  name!: string;

  @Column({ type: "text", nullable: true })
  description!: string | null;

  @OneToMany(() => CorrespondenceRevisionEntity, (revision) => revision.correspondence)
  revisions!: CorrespondenceRevisionEntity[];

  @JoinTable()
  @ManyToMany(() => DocumentEntity)
  dependsOnDocuments!: DocumentEntity[];

  @ManyToOne(() => ContractorEntity, { nullable: true })
  contractor!: ContractorEntity | null;

  @Column({ enum: CorrespondenceStatus })
  status!: CorrespondenceStatus;

  @Column({ default: false })
  isPrivate!: boolean;

  @OneToMany(() => CorrespondenceFavouriteEntity, (favourite) => favourite.correspondence)
  favourites!: CorrespondenceFavouriteEntity[];

  @JoinTable()
  @ManyToMany(() => AttributeValueEntity, (attributes) => attributes.correspondences)
  attributeValues!: AttributeValueEntity[];

  canArchive: boolean | null = null;

  canActive: boolean | null = null;

  calculateCanArchive(currentUser: { userId: string; role: UserRole }) {
    if (this.status !== CorrespondenceStatus.ACTIVE) {
      this.canArchive = false;
      return;
    }

    if (currentUser.role === UserRole.ADMIN) {
      this.canArchive = true;
      return;
    }

    if (this.author.id === currentUser.userId) {
      this.canArchive = true;
      return;
    }

    this.canArchive = false;
  }

  calculateCanActive(currentUser: { userId: string; role: UserRole }) {
    if (this.status !== CorrespondenceStatus.ARCHIVE) {
      this.canActive = false;
      return;
    }

    if (currentUser.role === UserRole.ADMIN) {
      this.canActive = true;
      return;
    }

    if (this.author.id === currentUser.userId) {
      this.canActive = true;
      return;
    }

    this.canActive = false;
  }

  calculateAllCans(currentUser: { userId: string; role: UserRole }) {
    this.calculateCanArchive(currentUser);
    this.calculateCanActive(currentUser);
  }

  // virtual fields -----

  favourite?: boolean;

  permissions?: PermissionEntity[];
}
