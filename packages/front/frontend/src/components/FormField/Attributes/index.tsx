import React from "react";
import { observer } from "mobx-react-lite";
import { useMemoizeCallback } from "@worksolutions/react-utils";
import { identity } from "@worksolutions/utils";
import { AttributeCategory } from "@app/shared-enums";

import { AttributeInEntityEntity } from "core/entities/attributes/attribute-in-entity";

import FormFieldWrapper, { FormFieldWrapperDirection } from "../Wrapper";
import { FormFieldTextEmptyView } from "../Text";
import Attribute from "./Attribute";
import CreateAttribute from "./CreateAttribute";

import { wrapperStyles } from "./style.css";

type EditPropsInterface = {
  category: AttributeCategory;
  edit: true;
  onDelete: (index: number) => void;
  onCreate: (entity: AttributeInEntityEntity) => void;
};

type FormFieldAttributesInterface = {
  direction?: FormFieldWrapperDirection;
  title?: string;
  value: AttributeInEntityEntity[];
} & ({ view: true } | EditPropsInterface);

function FormFieldAttributes({ direction, title, value, ...props }: FormFieldAttributesInterface) {
  const { onDelete } = props as EditPropsInterface;

  const handleDeleteFabric = useMemoizeCallback((index: number) => () => onDelete(index), [onDelete], identity);

  return (
    <FormFieldWrapper title={title} direction={direction} mode={"edit" in props ? "edit" : "view"}>
      <div className={wrapperStyles}>
        {"edit" in props ? (
          <>
            {value.map((attribute, key) => (
              <Attribute key={key} value={attribute} canDelete onDelete={handleDeleteFabric(key)} />
            ))}
            <CreateAttribute category={props.category} onlyAppending={false} onCreate={props.onCreate} />
          </>
        ) : value.length === 0 ? (
          <FormFieldTextEmptyView />
        ) : (
          <>
            {value.map((attribute, key) => (
              <Attribute key={key} value={attribute} />
            ))}
          </>
        )}
      </div>
    </FormFieldWrapper>
  );
}

export default observer(FormFieldAttributes);
