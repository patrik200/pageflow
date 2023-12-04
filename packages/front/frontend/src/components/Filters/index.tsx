import React from "react";
import { observer } from "mobx-react-lite";
import { useCollapse } from "@app/ui-kit";
import { useToggle } from "@worksolutions/react-utils";
import cn from "classnames";

import FilterButton from "./FilterButton";

import {
  filterButtonWrapperStyles,
  primaryRowStyles,
  secondaryRowOpenedSystemStyles,
  secondaryRowSystemStyles,
  secondaryRowsWrapperStyles,
  wrapperStyles,
  secondaryRowStyles,
} from "./style.css";

interface FiltersInterface {
  primaryRow: React.ReactNode;
  secondaryRow?: React.ReactNode;
}

function Filters({ primaryRow, secondaryRow }: FiltersInterface) {
  const [opened, toggle] = useToggle(false);
  const { initRef, style } = useCollapse(opened);

  return (
    <div className={wrapperStyles}>
      <div className={primaryRowStyles}>
        {primaryRow}
        {secondaryRow && (
          <div className={filterButtonWrapperStyles}>
            <FilterButton opened={opened} toggle={toggle} />
          </div>
        )}
      </div>
      {secondaryRow && (
        <div
          ref={initRef}
          style={style}
          className={cn(secondaryRowSystemStyles, opened && secondaryRowOpenedSystemStyles)}
        >
          <div className={secondaryRowsWrapperStyles}>{secondaryRow}</div>
        </div>
      )}
    </div>
  );
}

export default observer(Filters);

export function FiltersSecondaryRow({ children }: { children: React.ReactNode }) {
  return <div className={secondaryRowStyles}>{children}</div>;
}
