import { getMetadataStorage, validate, ValidationError } from "class-validator";
import { $mobx, action, computed, configure, makeObservable, observable, observe, runInAction } from "mobx";
import { deepObserve } from "mobx-utils";
import { classToPlain, ClassTransformOptions } from "class-transformer";
import { isNil, path, uniq, isArray, isFunction, splitByPoint } from "@worksolutions/utils";
import debounce from "lodash.debounce";
import type { ObservableArrayAdministration } from "mobx/dist/types/observablearray";

type ValidateOptions = {
  stopAtFirstError?: boolean;
  groups?: string[];
};

export const baseEntityCommonPlainObjectOptions: ClassTransformOptions = {
  strategy: "excludeAll",
  exposeUnsetFields: true,
  exposeDefaultValues: true,
};

// @ts-ignore
export type BaseEntityListControl = ReturnType<typeof BaseEntity.prototype.createListControls>;

interface OnSubmitHandlersInterface {
  onSuccess?: () => Promise<any> | any;
  onError?: (validationErrors: ValidationError[]) => any | Promise<any>;
}

configure({ safeDescriptors: false });

export class BaseEntity {
  static isBaseEntity(value: any): value is BaseEntity {
    return value instanceof BaseEntity;
  }

  static multiSubmit(options: (ValidateOptions & { throwReject?: boolean }) | undefined, ...entities: BaseEntity[]) {
    return new Promise<void>((resolve, reject) => {
      let successCount = 0;
      let errorCount = 0;

      async function handleCallback() {
        const allCount = successCount + errorCount;
        if (allCount !== entities.length) return;

        if (errorCount === 0) {
          resolve();
        } else {
          if (options?.throwReject) reject();
        }
      }

      function successCallback() {
        successCount++;
        return handleCallback();
      }

      function errorCallback() {
        errorCount++;
        return handleCallback();
      }

      if (entities.length === 0) {
        handleCallback();
        return;
      }

      entities.forEach((entity) => entity.submit({ onSuccess: successCallback, onError: errorCallback }, options));
    });
  }

  __schemaTransform?: (EntityClass: any) => any;

  @observable private _forceUpdaterInc = 0;

  @observable exposedInitial!: Record<string, any>;
  exposedKeys: string[] = [];

  @observable errors: Record<string, string | undefined> = {} as any;

  @observable submitted = false;
  @observable private forceShowErrorKeys: Record<string, boolean | undefined> = {} as any;

  @observable asyncValid = false;

  @computed
  get viewErrors(): Record<string, string | undefined> {
    return Object.fromEntries(
      Object.entries(this.errors)
        .map(([key, value]) => (this.submitted || (this.forceShowErrorKeys as any)[key] ? [key, value] : null!))
        .filter((error) => error),
    );
  }

  private matchExposedNamesToOwnNames: Record<string, string> | undefined;
  private runMatchExposedNamesToOwnNames(plain: Record<string, any>) {
    if (!this.matchExposedNamesToOwnNames) return plain;
    const result = { ...plain };
    Object.entries(this.matchExposedNamesToOwnNames).forEach(([plainName, ownName]) => {
      result[ownName] = result[plainName];
      delete result[plainName];
    });
    return result;
  }

  @computed
  get plainObject() {
    return this.runMatchExposedNamesToOwnNames(classToPlain(this, baseEntityCommonPlainObjectOptions));
  }

  getPlainObject({ groups }: { groups?: string[] } = {}) {
    return this.runMatchExposedNamesToOwnNames(classToPlain(this, { ...baseEntityCommonPlainObjectOptions, groups }));
  }

  validateAsync({ stopAtFirstError = false, groups }: ValidateOptions = {}) {
    return validate(this, { stopAtFirstError, groups, forbidUnknownValues: false });
  }

  @observable fullValid = false;
  @observable lastSubmitValid = false;

  initEntity({
    runMobxOnNode = false,
    runExposedKeysOnNode = false,
    runInitialsOnNode = false,
    runOnBuildCallbackOnNode = false,
    matchExposedNamesToOwnNames,
  }: {
    runMobxOnNode?: boolean;
    runInitialsOnNode?: boolean;
    runExposedKeysOnNode?: boolean;
    runOnBuildCallbackOnNode?: boolean;
    matchExposedNamesToOwnNames?: Record<string, string>;
  } = {}) {
    this.matchExposedNamesToOwnNames = matchExposedNamesToOwnNames;

    const isBrowser = typeof window !== "undefined";
    if (isBrowser || runOnBuildCallbackOnNode) {
      this.__runOnBuildCallbacks = this.__realRunOnBuildCallbacks.bind(this);
    }

    if (isBrowser || runInitialsOnNode || runExposedKeysOnNode) {
      this.registerOnBuildCallback(() => this.updateInitial());
    }

    if (isBrowser || runExposedKeysOnNode) {
      this.registerOnBuildCallback(() => this.updateExposedKeys());
    }

    if (isBrowser || runMobxOnNode) {
      makeObservable(this);
      this.disableDefaultEnumerableForMobx();
      this.subscribeOnErrorObserverForFullValid();
    }

    if (isBrowser) {
      this.__onSubmitCallbacksSet = new Set();
      this.__runOnSubmitCallbacks = this.__realRunOnSubmitCallbacks.bind(this);
    }
  }

  private subscribeOnErrorObserverForFullValid() {
    const validator = async () => {
      const [error] = await this.validateAsync({ stopAtFirstError: true });
      runInAction(() => (this.fullValid = !error));
    };

    observe(this, debounce(validator));
  }

  @action updateInitial() {
    this.exposedInitial = Object.assign({}, this.plainObject);
    this._forceUpdaterInc++;
  }

  @action updateExposedKeys() {
    this.exposedKeys = Object.keys(this.exposedInitial) as string[];
    this._forceUpdaterInc++;
  }

  @action resetAllErrors() {
    this.forceShowErrorKeys = {} as any;
    Object.keys(this.exposedInitial).forEach((key) => this.setError(key as any, undefined));
    this._forceUpdaterInc++;
  }

  @action reset() {
    Object.assign(this, this.exposedInitial);
    this.resetAllErrors();
  }

  private clearErrorForField(
    this: BaseEntity,
    fieldName: string,
    {
      clearErrorAfterChange,
      externalClearErrorAfterChange,
    }: { clearErrorAfterChange: boolean | undefined; externalClearErrorAfterChange: boolean | undefined },
  ) {
    if (!isNil(externalClearErrorAfterChange)) {
      if (externalClearErrorAfterChange) this.setError(fieldName, undefined);
      return;
    }

    if (!isNil(clearErrorAfterChange)) {
      if (clearErrorAfterChange) this.setError(fieldName, undefined);
      return;
    }

    this.setError(fieldName, undefined);
  }

  protected createSetter(this: BaseEntity, fieldName: string, clearErrorAfterChange?: boolean) {
    return action((value: any, externalClearErrorAfterChange?: boolean) => {
      if ((this as any)[fieldName] === value) return;
      (this as any)[fieldName] = value;
      this.clearErrorForField(fieldName, { clearErrorAfterChange, externalClearErrorAfterChange });
    });
  }

  protected createToggle(this: BaseEntity, fieldName: string, clearErrorAfterChange?: boolean) {
    return action((externalClearErrorAfterChange?: boolean) => {
      (this as any)[fieldName] = !(this as any)[fieldName];
      this.clearErrorForField(fieldName, { clearErrorAfterChange, externalClearErrorAfterChange });
    });
  }

  protected createPush(this: BaseEntity, fieldName: string, clearErrorAfterChange?: boolean) {
    return action((value: any, externalClearErrorAfterChange?: boolean) => {
      ((this as any)[fieldName] as any[]).push(value);
      this.clearErrorForField(fieldName, { clearErrorAfterChange, externalClearErrorAfterChange });
    });
  }

  protected createPushArray(this: BaseEntity, fieldName: string, clearErrorAfterChange?: boolean) {
    return action((value: any, externalClearErrorAfterChange?: boolean) => {
      ((this as any)[fieldName] as any[]).push(...value);
      this.clearErrorForField(fieldName, { clearErrorAfterChange, externalClearErrorAfterChange });
    });
  }

  protected createDeleteByValue(this: BaseEntity, fieldName: string) {
    return action((value: any) => {
      const index = ((this as any)[fieldName] as any[]).indexOf(value);
      if (index === -1) return;
      ((this as any)[fieldName] as any[]).splice(index, 1);
    });
  }

  protected createDeleteByIndex(this: BaseEntity, fieldName: string) {
    return action((index: number) => {
      ((this as any)[fieldName] as any[]).splice(index, 1);
    });
  }

  protected createUpdateByIndex(this: BaseEntity, fieldName: string, clearErrorAfterChange?: boolean) {
    return action((index: number, value: any, externalClearErrorAfterChange?: boolean) => {
      ((this as any)[fieldName] as any[])[index] = value;
      this.clearErrorForField(fieldName, { clearErrorAfterChange, externalClearErrorAfterChange });
    });
  }

  protected createReorder(this: BaseEntity, fieldName: string, idFieldName: string, clearErrorAfterChange?: boolean) {
    return action((newOrder: string[], externalClearErrorAfterChange?: boolean) => {
      const field = (this as any)[fieldName] as any[];
      ((this as any)[fieldName] as any[]) = newOrder.map(
        (id) => field.find((fieldValue) => fieldValue[idFieldName] === id)!,
      );
      this.clearErrorForField(fieldName, { clearErrorAfterChange, externalClearErrorAfterChange });
    });
  }

  protected createSelectAll(
    this: BaseEntity,
    selectableField: string,
    allAvailableField: string,
    allAvailableFieldIdFieldName: string,
    clearErrorAfterChange?: boolean,
  ) {
    const getAllIsSelected = () =>
      ((this as any)[selectableField] as any[]).length === ((this as any)[allAvailableField] as any[]).length;

    return {
      allIsSelected: computed(getAllIsSelected),
      toggleAll: action((externalClearErrorAfterChange?: boolean) => {
        if (getAllIsSelected()) {
          (this as any)[selectableField] = [];
        } else {
          (this as any)[selectableField] = [...((this as any)[allAvailableField] as any[])].map(
            (value) => value[allAvailableFieldIdFieldName],
          );
        }
        this.clearErrorForField(selectableField, { clearErrorAfterChange, externalClearErrorAfterChange });
      }),
    };
  }

  protected createToggleInList(this: BaseEntity, fieldName: string, clearErrorAfterChange?: boolean) {
    return action((id: string, externalClearErrorAfterChange?: boolean) => {
      const list = (this as any)[fieldName] as string[];
      if (list.includes(id)) {
        list.splice(list.indexOf(id), 1);
      } else {
        list.push(id);
      }

      this.clearErrorForField(fieldName, { clearErrorAfterChange, externalClearErrorAfterChange });
    });
  }

  protected createListControls(
    this: BaseEntity,
    selectableField: string,
    allAvailableField: string,
    allAvailableFieldIdFieldName: string,
    clearErrorAfterChange?: boolean,
  ) {
    const selectAll = this.createSelectAll(
      selectableField,
      allAvailableField,
      allAvailableFieldIdFieldName,
      clearErrorAfterChange,
    );
    const toggleInList = this.createToggleInList(selectableField, clearErrorAfterChange);
    return { selectAll, toggle: toggleInList };
  }

  @action setError = (fieldName: string, error: string | undefined, forceShow = false) => {
    const fieldNameArray = splitByPoint(fieldName);
    const prePathEntity = path(fieldNameArray.slice(0, -1), this) as BaseEntity;
    const resultFieldName = fieldNameArray[fieldNameArray.length - 1];
    if (forceShow) prePathEntity.forceShowErrorKeys[resultFieldName] = true;
    prePathEntity.errors[resultFieldName] = error;
    this._forceUpdaterInc++;
  };

  @action removeError = (fieldName: string) => {
    this.errors[fieldName] = undefined;
    this._forceUpdaterInc++;
  };

  @action async onlySubmit({ onSuccess, onError }: OnSubmitHandlersInterface, options: ValidateOptions = {}) {
    const validationErrors = await this.validateAsync(options);
    this._forceUpdaterInc++;
    if (validationErrors.length === 0) {
      await onSuccess?.();
      return;
    }

    validationErrors.forEach((error) => {
      if (!error.constraints) return;
      this.setError(error.property as any, error.constraints[Object.keys(error.constraints)[0]]);
    });
    await onError?.(validationErrors);
  }

  @action async submit(handlers: OnSubmitHandlersInterface, options?: ValidateOptions) {
    this.__runOnSubmitCallbacks();
    this.forceShowErrorKeys = {} as any;
    this.submitted = true;
    await this.onlySubmit(
      {
        onSuccess: () => {
          this.lastSubmitValid = true;
          handlers.onSuccess?.();
        },
        onError: (errors) => {
          this.lastSubmitValid = false;
          handlers.onError?.(errors);
        },
      },
      options,
    );
  }

  getValidationGroupFields(this: any, validationGroups: string[], strict = false) {
    const validators = getMetadataStorage().getTargetValidationMetadatas(
      this.__proto__.constructor,
      undefined!,
      false,
      strict,
      validationGroups,
    );
    return uniq(validators.map((validator) => validator.propertyName));
  }

  checkUnresolvedErrors(field?: string) {
    if (field) return !!(this.errors as any)[field];
    return !!Object.values(this.errors).find((error) => error);
  }

  @computed get hasAnyUnresolvedErrors() {
    return this.checkUnresolvedErrors();
  }

  checkErrorsOnValidationGroup(validationGroup: string) {
    const fields = this.getValidationGroupFields([validationGroup]);
    return !!fields.find((field) => this.checkUnresolvedErrors(field));
  }

  private registerOnFieldChangeCallback(
    this: BaseEntity,
    callback: () => void,
    fieldName: string,
    deep = false,
    certainField = false,
  ) {
    if (deep) return deepObserve((this as any)[fieldName], callback);
    if (certainField) return observe((this as any)[fieldName], callback);
    return observe(this as any, fieldName, callback);
  }

  emitArrayLengthChangedEmptyEventHack(this: BaseEntity, fieldName: string) {
    const field = (this as any)[fieldName][$mobx] as ObservableArrayAdministration;
    field.notifyArraySplice_(-1, [], []);
  }

  private createDisposableDebouncedCallback(callback: (...args: any[]) => void, debounceTime: number) {
    let disposed = false;
    const debouncedCallback = debounce((...args: any[]) => !disposed && callback(...args), debounceTime);
    return {
      debouncedCallback,
      disposeCallback: () => void (disposed = true),
    };
  }

  registerCustomOnFieldChangeCallback(
    this: BaseEntity,
    callback: () => void,
    fieldName: string,
    debounceTime: number,
    deep?: boolean,
    certainField?: boolean,
  ) {
    const { disposeCallback, debouncedCallback } = this.createDisposableDebouncedCallback(callback, debounceTime);
    const dispose = this.registerOnFieldChangeCallback(debouncedCallback, fieldName, deep, certainField);
    return () => {
      disposeCallback();
      dispose();
    };
  }

  registerCustomOnMultipleFieldChangeCallback(
    this: BaseEntity,
    callback: () => void,
    fieldNames: string[],
    debounceTime: number,
    deep?: boolean,
    certainField?: boolean,
  ) {
    const { disposeCallback, debouncedCallback } = this.createDisposableDebouncedCallback(callback, debounceTime);
    const disposers = fieldNames.map((fieldName) =>
      this.registerOnFieldChangeCallback(debouncedCallback, fieldName, deep, certainField),
    );
    return () => {
      disposeCallback();
      disposers.forEach((dispose) => dispose());
    };
  }

  registerCustomAsyncValidator(
    callback: (errors: ValidationError[]) => void,
    debounceTime: number,
    validateOptions?: ValidateOptions,
  ) {
    const { debouncedCallback, disposeCallback } = this.createDisposableDebouncedCallback(async () => {
      const errors = await this.validateAsync(validateOptions);
      runInAction(() => callback(errors));
    }, debounceTime);

    const dispose = observe(this, debouncedCallback);

    return () => {
      disposeCallback();
      dispose();
    };
  }

  registerAsyncValidFieldChecker({ groups = [], debounceTime = 10 }: { groups?: string[]; debounceTime?: number }) {
    this.registerCustomAsyncValidator(
      ([error]) => {
        runInAction(() => (this.asyncValid = !error));
      },
      debounceTime,
      { stopAtFirstError: true, groups },
    );
  }

  private __onBuildCallbacksSet!: Set<(entity: any) => void> | undefined;
  registerOnBuildCallback<ENTITY extends BaseEntity>(callback: (entity: ENTITY) => void) {
    if (!this.__onBuildCallbacksSet) this.__onBuildCallbacksSet = new Set();
    this.__onBuildCallbacksSet.add(callback);
    return () => this.__onBuildCallbacksSet!.delete(callback);
  }

  private __runOnBuildCallbackWasCalledAlready = false;
  private __realRunOnBuildCallbacks() {
    if (this.__runOnBuildCallbackWasCalledAlready) return;
    this.__runOnBuildCallbackWasCalledAlready = true;
    if (!this.__onBuildCallbacksSet) return;
    this.__onBuildCallbacksSet.forEach((callback) => callback(this));
  }

  __runOnBuildCallbacks() {}

  private __onSubmitCallbacksSet!: Set<(entity: any) => void>;

  registerOnSubmitCallback<ENTITY extends BaseEntity>(callback: (entity: ENTITY) => void) {
    this.__onSubmitCallbacksSet.add(callback);
    return () => this.__onSubmitCallbacksSet.delete(callback);
  }

  private __runOnSubmitCallbacks() {}

  private __realRunOnSubmitCallbacks() {
    this.__onSubmitCallbacksSet.forEach((callback) => callback(this));
  }

  @computed get nestedExposedKeys() {
    const nestedArrayFieldFirstItems = this.exposedKeys
      .filter((key) => isArray((this as any)[key]))
      .map((fieldKey) => {
        const [firstField] = (this as any)[fieldKey] as any[];
        return firstField ? { fieldKey, firstField } : null!;
      })
      .filter((item) => item && item.firstField instanceof BaseEntity) as {
      firstField: BaseEntity;
      fieldKey: string;
    }[];

    const nestedObjectFieldItems = this.exposedKeys
      .filter((key) => (this as any)[key] instanceof BaseEntity)
      .map((fieldKey) => ({ fieldKey, field: (this as any)[fieldKey] as BaseEntity }));

    return [
      ...this.exposedKeys,
      ...nestedObjectFieldItems
        .map(({ fieldKey, field }) => field.exposedKeys.map((key) => `${fieldKey}.${key}`))
        .flat(),
      ...nestedArrayFieldFirstItems
        .map(({ fieldKey, firstField }) => firstField.exposedKeys.map((key) => `${fieldKey}.{index}.${key}`))
        .flat(),
    ];
  }

  protected disableEnumerableForMobx(fieldName: string) {
    Object.defineProperty(this, fieldName, { enumerable: false, writable: true, value: (this as any)[fieldName] });
  }

  private disableDefaultEnumerableForMobx() {
    Object.keys(this).forEach((key) => {
      if (isFunction((this as any)[key])) this.disableEnumerableForMobx(key);
    });
    this.disableEnumerableForMobx("exposedInitial");
    this.disableEnumerableForMobx("exposedKeys");
    this.disableEnumerableForMobx("matchExposedNamesToOwnNames");
    this.disableEnumerableForMobx("errors");
    this.disableEnumerableForMobx("submitted");
    this.disableEnumerableForMobx("forceShowErrorKeys");
    this.disableEnumerableForMobx("asyncValid");
    this.disableEnumerableForMobx("fullValid");
    this.disableEnumerableForMobx("lastSubmitValid");
    this.disableEnumerableForMobx("_forceUpdaterInc");
    this.disableEnumerableForMobx("__schemaTransform");
    this.disableEnumerableForMobx("__runOnBuildCallbackWasCalledAlready");
    this.disableEnumerableForMobx("__onSubmitCallbacksSet");
    this.disableEnumerableForMobx("__onBuildCallbacksSet");
    this.disableEnumerableForMobx("__runOnBuildCallbacks");
    this.disableEnumerableForMobx("__runOnSubmitCallbacks");
  }
}
