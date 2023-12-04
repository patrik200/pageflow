import React from "react";
import { useChildrenMeasure, useMemoizeCallback } from "@worksolutions/react-utils";
import { identity } from "@worksolutions/utils";
import cn from "classnames";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import ActiveBackplate from "./internal/ActiveBackplate";
import Tab, { TabItemInterface } from "./internal/Tab";
import { tabSizes } from "./internal/Tab/config";

import { minWidthVar } from "./internal/Tab/style.css";
import { tabsContainerFitStyles, tabsContainerStyles, tabsWrapperStyles, wrapperStyles } from "./style.css";

export interface TabsInterface<CODE extends string> {
  className?: string;
  active: CODE;
  items: TabItemInterface<CODE>[];
  fitTabButtonsByContent?: boolean;
  fitTabButtonsAverageWidth?: boolean;
  emitChangeEventOnUnchangedValue?: boolean;
  onChange: (active: CODE) => void;
}

function Tabs<CODE extends string>({
  className,
  active,
  items,
  fitTabButtonsByContent = true,
  fitTabButtonsAverageWidth = true,
  emitChangeEventOnUnchangedValue,
  onChange,
}: TabsInterface<CODE>) {
  const { initRef, relativeMeasures, measures } = useChildrenMeasure(true);
  const activeIndex = React.useMemo(() => items.findIndex(({ code }) => code === active), [active, items]);

  const tabsWrapperStyle = React.useMemo(() => {
    const common = { padding: tabSizes.outerPadding + "px", gap: tabSizes.gap + "px" };

    if (!fitTabButtonsByContent || !measures || !fitTabButtonsAverageWidth) return common;
    const maxWidth = Math.max(...measures.map((measure) => measure.width));
    return { ...common, ...assignInlineVars({ [minWidthVar]: maxWidth + "px" }) };
  }, [fitTabButtonsAverageWidth, fitTabButtonsByContent, measures]);

  const handleClickFabric = useMemoizeCallback((code: CODE) => () => onChange(code), [onChange], identity);

  return (
    <div className={cn(wrapperStyles, className)}>
      <div className={cn(tabsContainerStyles, fitTabButtonsByContent && tabsContainerFitStyles)}>
        <ActiveBackplate activeIndex={activeIndex} measures={relativeMeasures} />
        <div style={tabsWrapperStyle} className={tabsWrapperStyles} ref={initRef}>
          {items.map(({ code, title }, index) => {
            const isActive = activeIndex === index;
            return (
              <Tab
                key={code}
                isActive={isActive}
                code={code}
                title={title}
                emitChangeEventOnUnchangedValue={emitChangeEventOnUnchangedValue}
                onClick={handleClickFabric(code)}
              />
            );
          })}
        </div>
      </div>
      {items[activeIndex]?.element}
    </div>
  );
}

export default React.memo(Tabs) as typeof Tabs;

export type { TabItemInterface } from "./internal/Tab";
