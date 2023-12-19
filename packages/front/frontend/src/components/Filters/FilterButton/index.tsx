import React from "react";
import { Button, Icon } from "@app/ui-kit";
import { useTranslation } from "@app/front-kit";
import cn from "classnames";

import {
  filterButtonDesktopStyles,
  filterButtonIconOpenedStyles,
  filterButtonIconStyles,
  filterButtonMobileStyles,
} from "./style.css";

interface FilterButtonInterface {
  opened: boolean;
  toggle: () => void;
}

function FilterButton({ opened, toggle }: FilterButtonInterface) {
  const { t } = useTranslation();

  return (
    <>
      <Button type="WITHOUT_BORDER" onClick={toggle} size="SMALL" className={filterButtonMobileStyles}>
        {opened ? <Icon icon="filterFilled" /> : <Icon icon="filterLine" />}
      </Button>
      <Button
        rightIconClassName={cn(filterButtonIconStyles, opened && filterButtonIconOpenedStyles)}
        iconRight="arrowDownSLine"
        type="OUTLINE"
        onClick={toggle}
        className={filterButtonDesktopStyles}
      >
        {t({ scope: "filters", name: "expander" })}
      </Button>
    </>
  );
}

export default React.memo(FilterButton);
