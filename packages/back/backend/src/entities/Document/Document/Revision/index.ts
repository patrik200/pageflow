import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { BaseGeneratedIDEntity } from "@app/back-kit";
import {
  DocumentRevisionApprovingStatuses,
  DocumentRevisionArchivedStatuses,
  DocumentRevisionStatus,
  UserFlowMode,
  UserRole,
} from "@app/shared-enums";

import { UserEntity } from "entities/User";

import { DocumentEntity } from "../index";
import { DocumentRevisionCommentEntity } from "./Comment";
import { DocumentRevisionFileEntity } from "./File";
import { DocumentRevisionFavouriteEntity } from "./Favourite";
import { DocumentRevisionResponsibleUserEntity } from "./Approving/UserApproving";
import { DocumentRevisionResponsibleUserFlowEntity } from "./Approving/UserFlowApproving";
import { DocumentRevisionReturnCountsEntity } from "./ReturnCount";

@Entity({ name: "document_revisions" })
export class DocumentRevisionEntity extends BaseGeneratedIDEntity {
  @ManyToOne(() => DocumentEntity, { nullable: false })
  document!: DocumentEntity;

  @ManyToOne(() => UserEntity, { onDelete: "CASCADE", nullable: false })
  author!: UserEntity;

  @Column() number!: string;

  @Column({ enum: DocumentRevisionStatus }) status!: DocumentRevisionStatus;

  @Column({ type: "int", default: 0 }) reviewRequestedCount!: number;

  @Column({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" }) statusChangeDate!: Date;

  @ManyToOne(() => UserEntity, { onDelete: "CASCADE", nullable: true })
  statusChangeAuthor!: UserEntity | null;

  @OneToMany(() => DocumentRevisionFileEntity, (revisionFile) => revisionFile.revision)
  files!: DocumentRevisionFileEntity[];

  @OneToMany(() => DocumentRevisionCommentEntity, (comment) => comment.revision)
  comments!: DocumentRevisionCommentEntity[];

  @JoinColumn()
  @OneToOne(() => DocumentRevisionResponsibleUserEntity, { nullable: true })
  responsibleUserApproving!: DocumentRevisionResponsibleUserEntity | null;

  @JoinColumn()
  @OneToOne(() => DocumentRevisionResponsibleUserFlowEntity, { nullable: true })
  responsibleUserFlowApproving!: DocumentRevisionResponsibleUserFlowEntity | null;

  @OneToMany(() => DocumentRevisionFavouriteEntity, (favourite) => favourite.revision)
  favourites!: DocumentRevisionFavouriteEntity[];

  @Column({ nullable: true, type: "text" }) returnMessage!: string | null;

  @OneToMany(() => DocumentRevisionReturnCountsEntity, (returnCounts) => returnCounts.revision)
  returnCounts!: DocumentRevisionReturnCountsEntity[];

  @Column({ type: "timestamptz", nullable: true }) approvingDeadline!: Date | null;

  @Column({ default: false }) approvingDeadlineNotified!: boolean;

  @Column({ default: false }) canProlongApprovingDeadline!: boolean;

  canUploadFiles: boolean | null = null;

  canEditComments: boolean | null = null;

  hasUnresolvedComments: boolean | null = null;

  canRunProlongApprovingDeadline: boolean | null = null;

  // ----------------------------- statuses

  canMoveToReviewStatus: boolean | null = null;

  canMoveToInitialStatusForCancelReview: boolean | null = null;

  canMoveToInitialStatusForFromRevoked: boolean | null = null;

  canMoveToApprovedStatusByResponsibleUser: boolean | null = null;

  moveToApprovedStatusByResponsibleUserStoppedByUnresolvedComment: boolean | null = null;

  moveToApprovedStatusByResponsibleUserStoppedByApproveAlready: boolean | null = null;

  moveToApprovedStatusByResponsibleUserFlowStoppedByUnresolvedComment: boolean | null = null;

  moveToApprovedStatusByResponsibleUserFlowStoppedByApproveAlready: boolean | null = null;

  moveToApprovedStatusByResponsibleUserFlowStoppedByNotApproved: boolean | null = null;

  canMoveToReturnStatus: boolean | null = null;

  canMoveToRevokedStatus: boolean | null = null;

  canMoveToArchiveStatus: boolean | null = null;

  canMoveToInitialStatusForRestore: boolean | null = null;

  canMoveToApprovedStatusByResponsibleUserFlowReviewer: boolean | null = null;

  calculateCanUploadFiles(sourceUser: { userId: string; role: UserRole }) {
    if (
      ![DocumentRevisionStatus.INITIAL, DocumentRevisionStatus.RETURNED, DocumentRevisionStatus.REVOKED].includes(
        this.status,
      )
    ) {
      this.canUploadFiles = false;
      return;
    }

    if (sourceUser.role === UserRole.ADMIN) {
      this.canUploadFiles = true;
      return;
    }

    if (this.author.id === sourceUser.userId) {
      this.canUploadFiles = true;
      return;
    }

    if (this.responsibleUserApproving?.user.id === sourceUser.userId) {
      this.canUploadFiles = true;
      return;
    }

    this.canUploadFiles = false;
  }

  calculateCanEditComment() {
    this.canEditComments = this.status !== DocumentRevisionStatus.APPROVED;
  }

  calculateHasUnresolvedComments() {
    if (this.status !== DocumentRevisionStatus.REVIEW) {
      this.hasUnresolvedComments = false;
      return;
    }

    this.hasUnresolvedComments = this.comments.some((comment) => !comment.resolved);
  }

  calculateCanRunProlongApprovingDeadline(sourceUser: { userId: string; role: UserRole }) {
    if (!DocumentRevisionApprovingStatuses.includes(this.status)) {
      this.canRunProlongApprovingDeadline = false;
      return;
    }

    if (this.approvingDeadline === null) {
      this.canRunProlongApprovingDeadline = false;
      return;
    }

    if (sourceUser.role === UserRole.ADMIN) {
      this.canRunProlongApprovingDeadline = true;
      return;
    }

    if (this.author.id === sourceUser.userId) {
      this.canRunProlongApprovingDeadline = true;
      return;
    }

    if (this.responsibleUserApproving?.user.id === sourceUser.userId) {
      this.canRunProlongApprovingDeadline = true;
      return;
    }

    this.canRunProlongApprovingDeadline = false;
  }

  calculateCanMoveToReviewStatus(sourceUser: { userId: string; role: UserRole }) {
    if (!this.responsibleUserApproving && !this.responsibleUserFlowApproving) {
      this.canMoveToReviewStatus = false;
      return;
    }

    if (![DocumentRevisionStatus.INITIAL, DocumentRevisionStatus.RETURNED].includes(this.status)) {
      this.canMoveToReviewStatus = false;
      return;
    }

    if (sourceUser.role === UserRole.ADMIN) {
      this.canMoveToReviewStatus = true;
      return;
    }

    if (this.author.id === sourceUser.userId) {
      this.canMoveToReviewStatus = true;
      return;
    }

    if (this.responsibleUserApproving?.user.id === sourceUser.userId) {
      this.canMoveToReviewStatus = true;
      return;
    }

    if (this.responsibleUserFlowApproving?.reviewer?.user.id === sourceUser.userId) {
      this.canMoveToReviewStatus = true;
      return;
    }

    this.canMoveToReviewStatus = false;
  }

  calculateCanMoveToInitialStatusForCancelReview(sourceUser: { userId: string; role: UserRole }) {
    if (this.status !== DocumentRevisionStatus.REVIEW) {
      this.canMoveToInitialStatusForCancelReview = false;
      return;
    }

    if (sourceUser.role === UserRole.ADMIN) {
      this.canMoveToInitialStatusForCancelReview = true;
      return;
    }

    if (this.author.id === sourceUser.userId) {
      this.canMoveToInitialStatusForCancelReview = true;
      return;
    }

    if (this.responsibleUserApproving?.user.id === sourceUser.userId) {
      this.canMoveToInitialStatusForCancelReview = true;
      return;
    }

    if (this.responsibleUserFlowApproving?.reviewer?.user.id === sourceUser.userId) {
      this.canMoveToInitialStatusForCancelReview = true;
      return;
    }

    this.canMoveToInitialStatusForCancelReview = false;
  }

  calculateCanMoveToInitialStatusForRestoreAfterRevoke() {
    if (this.status !== DocumentRevisionStatus.REVOKED) {
      this.canMoveToInitialStatusForFromRevoked = false;
      return;
    }

    this.canMoveToInitialStatusForFromRevoked = true;
  }

  calculateCanMoveToApprovedStatusByResponsibleUser(sourceUser: { userId: string; role: UserRole }) {
    this.moveToApprovedStatusByResponsibleUserStoppedByUnresolvedComment = false;
    this.moveToApprovedStatusByResponsibleUserStoppedByApproveAlready = false;

    if (this.status !== DocumentRevisionStatus.REVIEW) {
      this.canMoveToApprovedStatusByResponsibleUser = false;
      return;
    }

    if (!this.responsibleUserApproving) {
      this.canMoveToApprovedStatusByResponsibleUser = false;
      return;
    }

    if (this.responsibleUserApproving.approved) {
      this.canMoveToApprovedStatusByResponsibleUser = false;
      this.moveToApprovedStatusByResponsibleUserStoppedByApproveAlready = true;
      return;
    }

    if (this.hasUnresolvedComments) {
      this.moveToApprovedStatusByResponsibleUserStoppedByUnresolvedComment = true;
      this.canMoveToApprovedStatusByResponsibleUser = false;
      return;
    }

    if (sourceUser.role === UserRole.ADMIN) {
      this.canMoveToApprovedStatusByResponsibleUser = true;
      return;
    }

    if (this.responsibleUserApproving.user.id === sourceUser.userId) {
      this.canMoveToApprovedStatusByResponsibleUser = true;
      return;
    }

    this.canMoveToApprovedStatusByResponsibleUser = false;
  }

  calculateCanMoveToReturnStatus(sourceUser: { userId: string; role: UserRole }) {
    if (this.status !== DocumentRevisionStatus.REVIEW) {
      this.canMoveToReturnStatus = false;
      return;
    }

    if (sourceUser.role === UserRole.ADMIN) {
      this.canMoveToReturnStatus = true;
      return;
    }

    if (this.author.id === sourceUser.userId) {
      this.canMoveToReturnStatus = true;
      return;
    }

    if (this.responsibleUserApproving?.user.id === sourceUser.userId) {
      this.canMoveToReturnStatus = true;
      return;
    }

    this.canMoveToReturnStatus = false;
  }

  calculateCanMoveToRevokedStatus() {
    if (this.status === DocumentRevisionStatus.REVOKED) {
      this.canMoveToRevokedStatus = false;
      return;
    }

    if (DocumentRevisionArchivedStatuses.includes(this.status)) {
      this.canMoveToRevokedStatus = false;
      return;
    }

    this.canMoveToRevokedStatus = true;
  }

  calculateCanMoveToInitialStatusForRestore(sourceUser: { userId: string; role: UserRole }) {
    if (this.status !== DocumentRevisionStatus.ARCHIVE) {
      this.canMoveToInitialStatusForRestore = false;
      return;
    }

    if (sourceUser.role === UserRole.ADMIN) {
      this.canMoveToInitialStatusForRestore = true;
      return;
    }

    if (this.author.id === sourceUser.userId) {
      this.canMoveToInitialStatusForRestore = true;
      return;
    }

    if (this.responsibleUserApproving?.user.id === sourceUser.userId) {
      this.canMoveToInitialStatusForRestore = true;
      return;
    }

    this.canMoveToInitialStatusForRestore = false;
  }

  calculateCanMoveToArchiveStatus() {
    if (DocumentRevisionArchivedStatuses.includes(this.status)) {
      this.canMoveToArchiveStatus = false;
      return;
    }

    this.canMoveToArchiveStatus = true;
  }

  calculateResponsibleUserFlowApprovingRowsCompleted() {
    if (!this.responsibleUserFlowApproving) return;

    this.responsibleUserFlowApproving.rows.forEach((row) => {
      if (row.mode === UserFlowMode.AND) {
        row.completed = !row.users.some((rowUser) => !rowUser.approved);
        return;
      }

      row.completed = row.users.some((rowUser) => rowUser.approved);
    });

    this.responsibleUserFlowApproving.rowsApproved = !this.responsibleUserFlowApproving.rows.some(
      (row) => !row.completed,
    );

    if (!this.responsibleUserFlowApproving.reviewer) {
      this.responsibleUserFlowApproving.approved = this.responsibleUserFlowApproving.rowsApproved;
      return;
    }

    this.responsibleUserFlowApproving.approved =
      this.responsibleUserFlowApproving.rowsApproved && this.responsibleUserFlowApproving.reviewer.approved;
  }

  calculateResponsibleUserFlowApprovingRowUserCanApproveStatus(sourceUser: { userId: string; role: UserRole }) {
    if (!this.responsibleUserFlowApproving) return;

    if (this.status !== DocumentRevisionStatus.REVIEW) {
      this.responsibleUserFlowApproving.rows.forEach((row) => {
        row.users.forEach((rowUser) => (rowUser.canApprove = false));
      });
      return;
    }

    if (sourceUser.role === UserRole.ADMIN) {
      this.responsibleUserFlowApproving.rows.forEach((row) => {
        row.users.forEach((rowUser) => (rowUser.canApprove = !rowUser.approved));
      });
      return;
    }

    let canApproveNextRowIterations = true;
    this.responsibleUserFlowApproving.rows.forEach((row) => {
      row.users.forEach((rowUser) => {
        rowUser.canApprove = false;
        if (rowUser.approved) return;
        if (rowUser.user.id === sourceUser.userId) rowUser.canApprove = canApproveNextRowIterations;
      });

      if (row.forbidNextRowsApproving && !row.completed) canApproveNextRowIterations = false;
    });
  }

  calculateCanMoveToApprovedStatusByResponsibleUserFlow() {
    this.moveToApprovedStatusByResponsibleUserFlowStoppedByUnresolvedComment = false;
    this.moveToApprovedStatusByResponsibleUserFlowStoppedByApproveAlready = false;
    this.moveToApprovedStatusByResponsibleUserFlowStoppedByNotApproved = false;

    if (this.status !== DocumentRevisionStatus.REVIEW) return;

    if (!this.responsibleUserFlowApproving) return;

    if (this.hasUnresolvedComments) {
      this.moveToApprovedStatusByResponsibleUserFlowStoppedByUnresolvedComment = true;
    }

    if (this.responsibleUserFlowApproving.approved) {
      this.moveToApprovedStatusByResponsibleUserFlowStoppedByApproveAlready = true;
    }

    if (!this.responsibleUserFlowApproving.approved) {
      this.moveToApprovedStatusByResponsibleUserFlowStoppedByNotApproved = true;
    }
  }

  calculateCanMoveToApprovedStatusByResponsibleUserFlowReviewer(sourceUser: { userId: string; role: UserRole }) {
    this.canMoveToApprovedStatusByResponsibleUserFlowReviewer = false;

    if (this.status !== DocumentRevisionStatus.REVIEW) return;

    if (!this.responsibleUserFlowApproving?.reviewer) return;

    if (sourceUser.role === UserRole.ADMIN) {
      this.canMoveToApprovedStatusByResponsibleUserFlowReviewer = true;
      return;
    }

    if (this.responsibleUserFlowApproving.reviewer.user.id !== sourceUser.userId) return;

    this.canMoveToApprovedStatusByResponsibleUserFlowReviewer = true;
  }

  calculateAllCans(sourceUser: { userId: string; role: UserRole }) {
    this.calculateCanUploadFiles(sourceUser);
    this.calculateCanEditComment();
    this.calculateHasUnresolvedComments();
    this.calculateCanRunProlongApprovingDeadline(sourceUser);
    this.calculateCanMoveToReviewStatus(sourceUser);
    this.calculateCanMoveToInitialStatusForCancelReview(sourceUser);
    this.calculateCanMoveToInitialStatusForRestoreAfterRevoke();
    this.calculateCanMoveToApprovedStatusByResponsibleUser(sourceUser);
    this.calculateCanMoveToReturnStatus(sourceUser);
    this.calculateCanMoveToRevokedStatus();
    this.calculateCanMoveToInitialStatusForRestore(sourceUser);
    this.calculateCanMoveToArchiveStatus();
    this.calculateResponsibleUserFlowApprovingRowsCompleted();
    this.calculateResponsibleUserFlowApprovingRowUserCanApproveStatus(sourceUser);
    this.calculateCanMoveToApprovedStatusByResponsibleUserFlow();
    this.calculateCanMoveToApprovedStatusByResponsibleUserFlowReviewer(sourceUser);
  }

  // virtual fields -----
  favourite?: boolean;
}
