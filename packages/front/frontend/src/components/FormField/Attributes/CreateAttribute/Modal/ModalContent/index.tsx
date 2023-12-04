import React from "react";
import { observer } from "mobx-react-lite";
import { getErrorMessageWithCommonIntl, useTranslation, useViewContext } from "@app/front-kit";
import { AttributeCategory } from "@app/shared-enums";
import { useAsyncFn } from "@worksolutions/react-utils";
import { ModalActions, ModalTitle, SelectField, SelectFieldOption } from "@app/ui-kit";

import { AttributeInEntityEntity } from "core/entities/attributes/attribute-in-entity";
import { EditableAttributeInEntityEntity } from "core/entities/attributes/editable-attribute-in-entity";

import { AttributesStorage } from "core/storages/attributes";

import { wrapperStyles } from "./style.css";

interface CreateAttributeModalContentInterface {
  onlyAppending: boolean;
  category: AttributeCategory;
  onClose: () => void;
  onCreate: (attribute: AttributeInEntityEntity) => void;
}

function CreateAttributeModalContent({
  onlyAppending,
  category,
  onCreate,
  onClose,
}: CreateAttributeModalContentInterface) {
  const { t } = useTranslation("attributes");
  const { getAttributeTypes, getAttributeValues } = useViewContext().containerInstance.get(AttributesStorage);

  const entity = React.useMemo(() => EditableAttributeInEntityEntity.buildEmpty(), []);
  const virtualAttributeEntity = React.useMemo(() => EditableAttributeInEntityEntity.buildEmpty(), []);

  const [{ loading: typesLoading, value: types }, asyncLoadTypes] = useAsyncFn(getAttributeTypes, [getAttributeTypes], {
    loading: true,
  });
  const [{ loading: valuesLoading, value: values }, asyncLoadValues] = useAsyncFn(getAttributeValues, [
    getAttributeValues,
  ]);

  React.useEffect(() => void asyncLoadTypes(category), [asyncLoadTypes, category]);

  React.useEffect(
    () => entity.subscribeOnTypeChange((type) => void asyncLoadValues(category, type)),
    [asyncLoadValues, category, entity],
  );

  const typeOptions = React.useMemo<SelectFieldOption<string>[]>(() => {
    if (!types) return [];
    if (!types.success) return [];
    const options: SelectFieldOption<string>[] = types.types.map(({ key }) => ({ value: key, label: key }));
    if (virtualAttributeEntity.type)
      options.splice(0, 0, { value: virtualAttributeEntity.type, label: virtualAttributeEntity.type });
    return options;
  }, [types, virtualAttributeEntity.type]);

  const valueOptions = React.useMemo<SelectFieldOption<string>[]>(() => {
    if (!values) return [];
    if (!values.success) return [];
    const options: SelectFieldOption<string>[] = values.values.map(({ value }) => ({ value, label: value }));
    if (virtualAttributeEntity.value)
      options.splice(0, 0, { value: virtualAttributeEntity.value, label: virtualAttributeEntity.value });
    return options;
  }, [values, virtualAttributeEntity.value]);

  const handleCreateNewTypeCreate = React.useCallback(
    (text: string) => {
      if (onlyAppending) return;
      virtualAttributeEntity.setType(text);
      entity.setType(text);
    },
    [entity, onlyAppending, virtualAttributeEntity],
  );

  const handleCreateNewValue = React.useCallback(
    (text: string) => {
      if (onlyAppending) return;
      virtualAttributeEntity.setValue(text);
      entity.setValue(text);
    },
    [entity, onlyAppending, virtualAttributeEntity],
  );

  const handleSubmit = React.useCallback(() => {
    entity.submit({
      onSuccess: () => {
        onCreate(entity.toAttributeInEntityEntity);
        onClose();
      },
    });
  }, [entity, onClose, onCreate]);

  return (
    <>
      <ModalTitle>
        {t({ scope: "create_attribute_modal", name: "title", parameter: onlyAppending ? "append" : "create" })}
      </ModalTitle>
      <div className={wrapperStyles}>
        <SelectField
          required
          loading={typesLoading}
          placeholder={t({
            scope: "create_attribute_modal",
            place: "type_field",
            name: "placeholder",
          })}
          searchable
          searchPlaceholder={t({
            scope: "create_attribute_modal",
            place: "type_field",
            name: "search_placeholder",
            parameter: onlyAppending ? "append" : "create",
          })}
          emptyListText={t({
            scope: "create_attribute_modal",
            place: "type_field",
            name: "empty_search",
            parameter: onlyAppending ? "append" : "create",
          })}
          errorMessage={getErrorMessageWithCommonIntl(entity.viewErrors.type, t)}
          strategy="fixed"
          options={typeOptions}
          value={entity.type}
          onChange={entity.setType}
          onSearchFieldSubmit={handleCreateNewTypeCreate}
        />
        <SelectField
          required
          loading={valuesLoading}
          disabled={!entity.type}
          placeholder={t({
            scope: "create_attribute_modal",
            place: "value_field",
            name: "placeholder",
          })}
          searchable
          searchPlaceholder={t({
            scope: "create_attribute_modal",
            place: "value_field",
            name: "search_placeholder",
            parameter: onlyAppending ? "append" : "create",
          })}
          emptyListText={t({
            scope: "create_attribute_modal",
            place: "value_field",
            name: "empty_search",
            parameter: onlyAppending ? "append" : "create",
          })}
          errorMessage={getErrorMessageWithCommonIntl(entity.viewErrors.value, t)}
          strategy="fixed"
          options={valueOptions}
          value={entity.value}
          onChange={entity.setValue}
          onSearchFieldSubmit={handleCreateNewValue}
        />
      </div>
      <ModalActions
        primaryActionText={t({
          scope: "create_attribute_modal",
          place: "actions",
          name: "submit",
          parameter: onlyAppending ? "append" : "create",
        })}
        onPrimaryActionClick={handleSubmit}
      />
    </>
  );
}

export default observer(CreateAttributeModalContent);
