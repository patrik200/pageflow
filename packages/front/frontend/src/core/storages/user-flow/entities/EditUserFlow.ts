import { BaseEntity, makeTransformableObject, ValidateBusiness_userFlow_deadlineDaysIncludeWeekends } from "@app/kit";
import { action, computed, observable } from "mobx";
import { ArrayMinSize, IsNotEmpty, MinLength } from "class-validator";
import { UserFlowMode } from "@app/shared-enums";
import uuid from "uuidjs";

import { USER_FLOW_DEADLINE_DAYS_AMOUNT_VALIDATION, NOT_EMPTY_VALIDATION } from "core/commonValidationErrors";

import { UserFlowEntity, UserFlowRowEntity, UserFlowRowUserEntity } from "core/entities/userFlow/userFlow";

export class EditUserFlowRowUserEntity extends BaseEntity {
  static buildEmpty() {
    return makeTransformableObject(EditUserFlowRowUserEntity);
  }

  static buildFromUserFlowRowUserEntity(entity: UserFlowRowUserEntity) {
    return makeTransformableObject(EditUserFlowRowUserEntity, () => ({
      id: entity.user.id,
      description: entity.description,
    }));
  }

  constructor() {
    super();
    this.initEntity();
  }

  @observable @IsNotEmpty({ message: NOT_EMPTY_VALIDATION }) id: string | null = null;
  setId = this.createSetter("id");

  @observable description = "";
  setDescription = this.createSetter("description");

  @computed get apiReady() {
    return {
      id: this.id,
      description: this.description,
    };
  }
}

export class EditUserFlowRowEntity extends BaseEntity {
  static buildEmpty() {
    return makeTransformableObject(EditUserFlowRowEntity);
  }

  static buildFromUserFlowRowEntity(entity: UserFlowRowEntity) {
    return makeTransformableObject(EditUserFlowRowEntity, () => ({
      mode: entity.mode,
      name: entity.name,
      forbidNextRowsApproving: entity.forbidNextRowsApproving,
      users: entity.users.map(EditUserFlowRowUserEntity.buildFromUserFlowRowUserEntity),
    }));
  }

  constructor() {
    super();
    this.initEntity();
  }

  readonly _virtualId = uuid.generate();

  @observable mode: UserFlowMode = UserFlowMode.AND;

  @observable @MinLength(1, { message: NOT_EMPTY_VALIDATION }) name = "";
  setName = this.createSetter("name");

  @observable forbidNextRowsApproving = false;
  setForbidNextRowsApproving = this.createSetter("forbidNextRowsApproving");

  @observable
  @ArrayMinSize(1, { message: NOT_EMPTY_VALIDATION })
  users: EditUserFlowRowUserEntity[] = [EditUserFlowRowUserEntity.buildEmpty()];
  @action addUserOrMode = () => {
    this.mode = UserFlowMode.OR;
    this.users.push(EditUserFlowRowUserEntity.buildEmpty());
  };
  @action addUserAndMode = () => {
    this.mode = UserFlowMode.AND;
    this.users.push(EditUserFlowRowUserEntity.buildEmpty());
  };
  deleteUserByValue = this.createDeleteByValue("users");

  @computed get canAddOrMode() {
    return this.users.length < 2 || this.mode === UserFlowMode.OR;
  }

  @computed get canAddAndMode() {
    return this.users.length < 2 || this.mode === UserFlowMode.AND;
  }

  @computed get apiReady() {
    return {
      name: this.name,
      forbidNextRowsApproving: this.forbidNextRowsApproving,
      mode: this.mode,
      users: this.users.map((user) => user.apiReady),
    };
  }
}

export class EditUserFlowEntity extends BaseEntity {
  static buildEmpty() {
    return makeTransformableObject(EditUserFlowEntity);
  }

  static buildFromUserFlow(userFlow: UserFlowEntity) {
    return makeTransformableObject(EditUserFlowEntity, () => ({
      id: userFlow.id,
      name: userFlow.name,
      deadlineDaysAmount: userFlow.deadlineDaysAmount === null ? "" : userFlow.deadlineDaysAmount.toString(),
      deadlineDaysIncludeWeekends: userFlow.deadlineDaysIncludeWeekends,
      rows: userFlow.rows.map(EditUserFlowRowEntity.buildFromUserFlowRowEntity),
      reviewerId: userFlow.reviewer?.user.id ?? null,
    }));
  }

  constructor() {
    super();
    this.initEntity();
    this.registerOnBuildCallback(() => {
      this.subscribeOnDeadlineDaysAmountEvents();
    });
  }

  private subscribeOnDeadlineDaysAmountEvents() {
    this.registerCustomOnFieldChangeCallback(
      () => {
        this.removeError("rows");
        this.removeError("deadlineDaysIncludeWeekends");
      },
      "deadlineDaysAmount",
      10,
    );
  }

  private readonly id!: string;

  @observable @MinLength(1, { message: NOT_EMPTY_VALIDATION }) name = "";
  setName = this.createSetter("name");

  @observable deadlineDaysAmount = "";
  setDeadlineDaysAmount = this.createSetter("deadlineDaysAmount");

  @observable
  @ValidateBusiness_userFlow_deadlineDaysIncludeWeekends({ message: USER_FLOW_DEADLINE_DAYS_AMOUNT_VALIDATION })
  deadlineDaysIncludeWeekends = false;
  setDeadlineDaysIncludeWeekends = this.createSetter("deadlineDaysIncludeWeekends");

  @observable
  rows: EditUserFlowRowEntity[] = [EditUserFlowRowEntity.buildEmpty()];
  @action addEmptyRow = () => this.rows.push(EditUserFlowRowEntity.buildEmpty());
  reoderRows = this.createReorder("rows", "_virtualId");
  deleteRowByValue = this.createDeleteByValue("rows");

  @observable reviewerId: string | null = null;
  setReviewerId = this.createSetter("reviewerId");

  @computed get canDelete() {
    return this.rows.length > 1;
  }

  @computed get apiReady() {
    return {
      urlParams: {
        id: this.id ?? "",
      },
      body: {
        name: this.name,
        deadlineDaysAmount: this.deadlineDaysAmount === "" ? null : parseInt(this.deadlineDaysAmount),
        deadlineDaysIncludeWeekends: this.deadlineDaysIncludeWeekends,
        reviewerId: this.reviewerId,
        rows: this.rows.map((row) => row.apiReady),
      },
    };
  }

  async fullSubmit(onSuccess: () => void) {
    await BaseEntity.multiSubmit({}, this, ...this.rows, ...this.rows.flatMap((row) => row.users));
    onSuccess();
  }
}
