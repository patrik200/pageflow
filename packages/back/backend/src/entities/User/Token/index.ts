import { BaseGeneratedIDEntity } from "@app/back-kit";
import { Column, Entity, ManyToOne } from "typeorm";

import { ClientEntity } from "entities/Client";

import { UserEntity } from "../index";

@Entity({ name: "user_tokens" })
export class UserTokenEntity extends BaseGeneratedIDEntity {
  @Column() accessToken!: string;

  @Column() accessTokenExpiresAt!: Date;

  @Column() refreshToken!: string;

  @Column() refreshTokenExpiresAt!: Date;

  @ManyToOne(() => UserEntity, { onDelete: "CASCADE" }) user!: UserEntity;

  @ManyToOne(() => ClientEntity, { onDelete: "CASCADE" }) client!: ClientEntity;
}
