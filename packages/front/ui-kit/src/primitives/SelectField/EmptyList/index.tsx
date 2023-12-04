import React from "react";

import Typography from "primitives/Typography";

import { emptySearchResultsStyles } from "./style.css";

export interface SelectCheckboxesAndSearchEmptyListInterface {
  emptyListText: string;
}

function SelectCheckboxesAndSearchEmptyList({ emptyListText }: SelectCheckboxesAndSearchEmptyListInterface) {
  return <Typography className={emptySearchResultsStyles}>{emptyListText}</Typography>;
}

export default React.memo(SelectCheckboxesAndSearchEmptyList);
