import {
  AfterLoad,
  CreateDateColumn,
  DeleteDateColumn,
  Index,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Repository,
  UpdateDateColumn,
} from "typeorm";
import { config } from "@app/core-config";

export abstract class BaseEntityPrimitive {
  @CreateDateColumn({ type: "timestamptz" }) createdAt!: Date;
  @UpdateDateColumn({ type: "timestamptz" }) updatedAt!: Date;
  @DeleteDateColumn({ type: "timestamptz" }) deletedAt!: Date;
}

export abstract class BaseGeneratedIDEntity<ID extends string = string> extends BaseEntityPrimitive {
  @Index() @PrimaryGeneratedColumn((config.productionEnv ? "uuid" : "increment") as "uuid") id!: ID;

  @AfterLoad()
  private updateDevId() {
    if (!config.productionEnv) this.id = this.id.toString() as ID;
  }
}

if (!config.productionEnv) {
  const originalSave = Repository.prototype.save;
  Repository.prototype.save = async function (...args: any) {
    const response = await originalSave.apply(this, args);

    if (Array.isArray(response)) {
      response.forEach((entity) => (entity.id = entity.id.toString()));
      return response;
    }

    response.id = response.id.toString();
    return response;
  };
}

export abstract class BaseIDEntity<ID extends string = string> extends BaseEntityPrimitive {
  @Index() @PrimaryColumn({ type: "varchar" }) id!: ID;
}
