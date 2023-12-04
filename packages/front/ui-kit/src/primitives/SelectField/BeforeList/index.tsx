import React from "react";
import { preventDefaultAndStopPropagationHandler } from "@worksolutions/react-utils";

import InputField from "primitives/InputField";
import Form from "primitives/Form";
import { VisibilityManagerContext } from "primitives/VisibilityManager";

import { formStyles, searchStyles } from "./style.css";

export interface SelectCheckboxesAndSearchBeforeListInterface {
  search: string;
  searchPlaceholder: string;
  setSearch: (value: string) => void;
  onSubmit?: (value: string) => void;
}

function SelectCheckboxesAndSearchBeforeList({
  search,
  searchPlaceholder,
  setSearch,
  onSubmit,
}: SelectCheckboxesAndSearchBeforeListInterface) {
  const visibilityManagerContext = React.useContext(VisibilityManagerContext);

  const handleSubmit = React.useCallback(
    (event: React.FormEvent) => {
      preventDefaultAndStopPropagationHandler(event);
      visibilityManagerContext.hide();
      if (onSubmit) {
        onSubmit(search);
        setSearch("");
      }
    },
    [onSubmit, search, setSearch, visibilityManagerContext],
  );

  return (
    <Form className={formStyles} onSubmit={handleSubmit}>
      <InputField
        className={searchStyles}
        materialPlaceholder={false}
        placeholder={searchPlaceholder}
        fieldItemRight="searchLine"
        value={search}
        onChangeInput={setSearch}
      />
    </Form>
  );
}

export default React.memo(SelectCheckboxesAndSearchBeforeList);
