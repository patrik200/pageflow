import React from "react";
import { observer } from "mobx-react-lite";
import { TabItemInterface, Tabs } from "@app/ui-kit";

import { BreadcrumbInterface } from "components/Breadcrumbs";

import CardTitlePreset, { CardTitlePresetInterface } from "../CardTitle";

import { tabsWrapperStyles } from "./style.css";

interface CardTitleTabsPresetInterface<CODE extends string> extends Omit<CardTitlePresetInterface, "children"> {
  breadcrumbs?: BreadcrumbInterface[];
  active: CODE;
  items: TabItemInterface<CODE>[];
  onChange: (active: CODE) => void;
}

function CardTitleTabsPreset<CODE extends string>({
  active,
  items,
  onChange,
  ...props
}: CardTitleTabsPresetInterface<CODE>) {
  React.useEffect(() => {
    if (items.some((item) => item.code === active)) return;
    onChange(items[0].code);
  }, [active, items, onChange]);

  return (
    <CardTitlePreset {...props}>
      <div className={tabsWrapperStyles}>
        <Tabs fitTabButtonsAverageWidth={false} items={items} active={active} onChange={onChange} />
      </div>
    </CardTitlePreset>
  );
}

export default observer(CardTitleTabsPreset);
