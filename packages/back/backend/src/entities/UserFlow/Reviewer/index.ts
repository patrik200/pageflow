import { Entity, ManyToOne, OneToOne } from "typeorm";
import { BaseGeneratedIDEntity } from "@app/back-kit";

import { UserEntity } from "entities/User";

import { UserFlowEntity } from "../index";

@Entity({ name: "user_flow_reviewers" })
export class UserFlowReviewerEntity extends BaseGeneratedIDEntity {
  @ManyToOne(() => UserEntity, { nullable: false }) user!: UserEntity;

  @OneToOne(() => UserFlowEntity, (userFlow) => userFlow.reviewer, { nullable: false })
  userFlow!: UserFlowEntity;
}
