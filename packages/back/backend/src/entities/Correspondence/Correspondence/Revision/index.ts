import { BaseGeneratedIDEntity } from "@app/back-kit";
import { CorrespondenceRevisionStatus, UserRole } from "@app/shared-enums";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";

import { UserEntity } from "entities/User";

import { CorrespondenceEntity } from "../index";
import { CorrespondenceRevisionFileEntity } from "./File";
import { CorrespondenceRevisionCommentEntity } from "./Comment";
import { CorrespondenceRevisionFavouriteEntity } from "./Favourite";

@Entity({ name: "correspondence_revisions" })
export class CorrespondenceRevisionEntity extends BaseGeneratedIDEntity {
  @ManyToOne(() => CorrespondenceEntity, { nullable: false })
  correspondence!: CorrespondenceEntity;

  @ManyToOne(() => UserEntity, { onDelete: "CASCADE", nullable: false })
  author!: UserEntity;

  @Column()
  number!: string;

  @Column({ enum: CorrespondenceRevisionStatus })
  status!: CorrespondenceRevisionStatus;

  @OneToMany(() => CorrespondenceRevisionFileEntity, (revisionFile) => revisionFile.revision)
  files!: CorrespondenceRevisionFileEntity[];

  @OneToMany(() => CorrespondenceRevisionCommentEntity, (comment) => comment.revision)
  comments!: CorrespondenceRevisionCommentEntity[];

  @OneToMany(() => CorrespondenceRevisionFavouriteEntity, (favourite) => favourite.revision)
  favourites!: CorrespondenceRevisionFavouriteEntity[];

  canArchiveByStatus: boolean | null = null;

  canActiveByStatus: boolean | null = null;

  calculateCanArchive() {
    this.canArchiveByStatus = this.status === CorrespondenceRevisionStatus.ACTIVE;
  }

  calculateCanActive() {
    this.canActiveByStatus = this.status === CorrespondenceRevisionStatus.ARCHIVE;
  }

  // eslint-disable-next-line unused-imports/no-unused-vars
  calculateAllCans(currentUser: { userId: string; role: UserRole }) {
    this.calculateCanArchive();
    this.calculateCanActive();
  }

  isArchivedAutomatically() {
    return [
      CorrespondenceRevisionStatus.ARCHIVED_AUTOMATICALLY_RESTORE_ACTIVE,
      CorrespondenceRevisionStatus.ARCHIVED_AUTOMATICALLY_RESTORE_ARCHIVE,
    ].includes(this.status);
  }

  // virtual fields ------
  favourite?: boolean;
}
