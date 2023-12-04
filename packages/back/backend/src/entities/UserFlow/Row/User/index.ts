import { BaseGeneratedIDEntity } from "@app/back-kit";
import { Column, Entity, ManyToOne } from "typeorm";

import { UserEntity } from "entities/User";

import { UserFlowRowEntity } from "../index";

@Entity({ name: "user_flow_row_user" })
export class UserFlowRowUserEntity extends BaseGeneratedIDEntity {
  @ManyToOne(() => UserFlowRowEntity, (row) => row.users, { nullable: false, onDelete: "CASCADE" })
  row!: UserFlowRowEntity;

  @Column() description!: string;

  @ManyToOne(() => UserEntity, { nullable: false }) user!: UserEntity;
}
