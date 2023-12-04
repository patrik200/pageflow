import { BaseGeneratedIDEntity } from "@app/back-kit";
import { UserFlowMode } from "@app/shared-enums";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";

import { UserFlowEntity } from "../index";
import { UserFlowRowUserEntity } from "./User";

@Entity({ name: "user_flow_rows" })
export class UserFlowRowEntity extends BaseGeneratedIDEntity {
  @ManyToOne(() => UserFlowEntity, (userFlow) => userFlow.rows, { nullable: false, onDelete: "CASCADE" })
  userFlow!: UserFlowEntity;

  @Column() sort!: number;

  @Column() name!: string;

  @Column({ enum: UserFlowMode }) mode!: UserFlowMode;

  @Column() forbidNextRowsApproving!: boolean;

  @OneToMany(() => UserFlowRowUserEntity, (user) => user.row) users!: UserFlowRowUserEntity[];
}
