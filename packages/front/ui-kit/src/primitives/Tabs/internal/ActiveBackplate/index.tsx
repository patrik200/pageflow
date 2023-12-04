import React from "react";

import { activeBackplateStyle } from "./style.css";

interface ActiveBackplateInterface {
  activeIndex: number;
  measures: DOMRect[] | null;
}

function ActiveBackplate({ activeIndex, measures }: ActiveBackplateInterface) {
  if (!measures || activeIndex === -1) return null;
  return <RenderActiveBackplate measure={measures[activeIndex]} />;
}

function RenderActiveBackplate({ measure }: { measure: DOMRect }) {
  const style = React.useMemo(
    () => ({ width: measure.width, left: measure.left, height: "100%" }),
    [measure.left, measure.width],
  );

  return <div style={style} className={activeBackplateStyle} />;
}
export default React.memo(ActiveBackplate);
