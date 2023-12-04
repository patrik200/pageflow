import { BaseGeneratedIDEntity } from "@app/back-kit";
import { DocumentRevisionStatus, DocumentStatus, UserRole } from "@app/shared-enums";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne } from "typeorm";

import { ClientEntity } from "entities/Client";
import { ContractorEntity } from "entities/Contractor";
import { CorrespondenceEntity } from "entities/Correspondence/Correspondence";
import { CorrespondenceRootGroupEntity } from "entities/Correspondence/Group/rootGroup";
import { DictionaryValueEntity } from "entities/Dictionary/Dictionary";
import { UserEntity } from "entities/User";
import { UserFlowEntity } from "entities/UserFlow";
import { AttributeValueEntity } from "entities/Attribute/value";

import { DocumentGroupEntity } from "../Group/group";
import { DocumentRootGroupEntity } from "../Group/rootGroup";
import { DocumentFavouriteEntity } from "./Favourite";
import { DocumentRevisionEntity } from "./Revision";
import { PermissionEntity } from "../../Permission";

@Entity({ name: "documents" })
export class DocumentEntity extends BaseGeneratedIDEntity {
  @ManyToOne(() => ClientEntity, { onDelete: "CASCADE", nullable: false })
  client!: ClientEntity;

  @ManyToOne(() => DocumentRootGroupEntity, (group) => group.allChildrenDocuments, { nullable: false })
  rootGroup!: DocumentRootGroupEntity;

  @ManyToOne(() => DocumentGroupEntity, (group) => group.childrenDocuments, { nullable: true })
  parentGroup!: DocumentGroupEntity | null;

  @ManyToOne(() => UserEntity, { onDelete: "CASCADE", nullable: false })
  author!: UserEntity;

  @Column()
  name!: string;

  @Column({ type: "text", nullable: true })
  description!: string | null;

  @Column({ type: "text", nullable: true })
  remarks!: string | null;

  @ManyToOne(() => UserEntity, { nullable: true })
  responsibleUser!: UserEntity | null;

  @ManyToOne(() => UserFlowEntity, { nullable: true, onDelete: "SET NULL" })
  responsibleUserFlow!: UserFlowEntity | null;

  @ManyToOne(() => DictionaryValueEntity, { nullable: true })
  type!: DictionaryValueEntity | null;

  @OneToMany(() => DocumentRevisionEntity, (revision) => revision.document)
  revisions!: DocumentRevisionEntity[];

  @JoinTable()
  @ManyToMany(() => CorrespondenceEntity)
  dependsOnCorrespondences!: CorrespondenceEntity[];

  @ManyToOne(() => ContractorEntity, { nullable: true })
  contractor!: ContractorEntity | null;

  @Column({ type: "timestamptz", nullable: true })
  startDatePlan!: Date | null;

  @Column({ type: "timestamptz", nullable: true })
  startDateForecast!: Date | null;

  @Column({ type: "timestamptz", nullable: true })
  startDateFact!: Date | null;

  @Column({ type: "timestamptz", nullable: true })
  endDatePlan!: Date | null;

  @Column({ type: "timestamptz", nullable: true })
  endDateForecast!: Date | null;

  @Column({ type: "timestamptz", nullable: true })
  endDateFact!: Date | null;

  @JoinColumn()
  @OneToOne(() => CorrespondenceRootGroupEntity, (group) => group.parentDocument, {
    nullable: true,
    onDelete: "SET NULL",
  })
  correspondenceRootGroup!: CorrespondenceRootGroupEntity;

  @Column({ enum: DocumentStatus })
  status!: DocumentStatus;

  @Column({ default: false })
  isPrivate!: boolean;

  @OneToMany(() => DocumentFavouriteEntity, (favourite) => favourite.document)
  favourites!: DocumentFavouriteEntity[];

  // "Виртуальное поле", создает поле в БД, но блокирует взаимодействие привичными способами ОРМ.
  // Нужно для "вычисляемых полей". (см. https://stackoverflow.com/a/66696949/10941348)
  @Column({ type: "text", select: false, insert: false, readonly: true, nullable: true })
  lastRevisionStatus?: DocumentRevisionStatus | null;

  @JoinTable()
  @ManyToMany(() => AttributeValueEntity, (attributes) => attributes.documents)
  attributeValues!: AttributeValueEntity[];

  canArchive: boolean | null = null;

  canActive: boolean | null = null;

  calculateCanArchive(currentUser: { userId: string; role: UserRole }) {
    if (this.status !== DocumentStatus.ACTIVE) {
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

    if (this.responsibleUser?.id === currentUser.userId) {
      this.canArchive = true;
      return;
    }

    this.canArchive = false;
  }

  calculateCanActive(currentUser: { userId: string; role: UserRole }) {
    if (this.status !== DocumentStatus.ARCHIVE) {
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

    if (this.responsibleUser?.id === currentUser.userId) {
      this.canArchive = true;
      return;
    }

    this.canActive = false;
  }

  calculateAllCans(currentUser: { userId: string; role: UserRole }) {
    this.calculateCanArchive(currentUser);
    this.calculateCanActive(currentUser);
  }

  // virtual fields -------

  favourite?: boolean;

  permissions?: PermissionEntity[];
}
