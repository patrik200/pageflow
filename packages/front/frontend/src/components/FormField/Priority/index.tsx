import React from "react";
import { TicketPriorities } from "@app/shared-enums";

import Priority from "components/Priority";

import FormFieldWrapper, { FormFieldWrapperDirection } from "../Wrapper";

interface FormFieldPriorityInterface {
  direction?: FormFieldWrapperDirection;
  value: TicketPriorities;
  title: string;
}

function FormFieldPriority({ title, value, direction }: FormFieldPriorityInterface) {
  return (
    <FormFieldWrapper title={title} direction={direction} mode="view">
      <Priority priority={value} />
    </FormFieldWrapper>
  );
}

export default React.memo(FormFieldPriority);
