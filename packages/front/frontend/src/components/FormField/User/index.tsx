import React from "react";
import { observer } from "mobx-react-lite";
import { Icon } from "@app/ui-kit";

import { UserEntity } from "core/entities/user";

import FormFieldWrapper, { FormFieldWrapperDirection } from "../Wrapper";
import { FormFieldTextEmptyView } from "../Text";
import UserRow from "../../UserRow";

import { checkIconStyles, userWrapperStyles } from "./style.css";

type FormFieldUserInterface = {
  direction?: FormFieldWrapperDirection;
  title?: string;
  value: UserEntity | null;
  checked?: boolean;
};

function FormFieldUser({ direction, title, value, checked, ...props }: FormFieldUserInterface) {
  return (
    <FormFieldWrapper title={title} direction={direction} mode={"edit" in props ? "edit" : "view"}>
      {value ? (
        <div className={userWrapperStyles}>
          <UserRow user={value} />
          {checked && <Icon className={checkIconStyles} icon="checkboxCircleFill" />}
        </div>
      ) : (
        <FormFieldTextEmptyView />
      )}
    </FormFieldWrapper>
  );
}

export default observer(FormFieldUser);
