import React from "react";
import { Button } from "@app/ui-kit";
import { useTranslation } from "@app/front-kit";
import cn from "classnames";

import { filterButtonIconOpenedStyles, filterButtonIconStyles } from "./style.css";

interface FilterButtonInterface {
  opened: boolean;
  toggle: () => void;
}

function FilterButton({ opened, toggle }: FilterButtonInterface) {
  const { t } = useTranslation();
  return (
    <Button
      rightIconClassName={cn(filterButtonIconStyles, opened && filterButtonIconOpenedStyles)}
      iconRight="arrowDownSLine"
      type="OUTLINE"
      onClick={toggle}
    >
      {t({ scope: "filters", name: "expander" })}
    </Button>
  );
}

export default React.memo(FilterButton);
