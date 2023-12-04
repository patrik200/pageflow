import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from "typeorm";
import { BaseGeneratedIDEntity } from "@app/back-kit";

import { UserEntity } from "../User";
import { ClientEntity } from "../Client";

@Entity({ name: "work_groups" })
export class WorkGroupEntity extends BaseGeneratedIDEntity {
  @ManyToOne(() => ClientEntity, { onDelete: "CASCADE" }) client!: ClientEntity;

  @Column() name!: string;

  @JoinTable() @ManyToMany(() => UserEntity) users!: UserEntity[];

  @ManyToOne(() => UserEntity, { nullable: true }) supervisor!: UserEntity | null;
}
