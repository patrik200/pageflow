import React, { useCallback } from "react";
import { provideRef, useBoolean, useEffectSkipFirst } from "@worksolutions/react-utils";

import HandleClickOutside, { ClickOutsideIgnoreElements } from "primitives/HandleClickOutside";

import { VisibilityManagerContext, VisibilityManagerContextInterface } from "./context";

export interface VisibilityManagerInterface {
  closeOnClickOutside?: boolean;
  outsideClickIgnoreElements?: ClickOutsideIgnoreElements;
  onVisibilityChange?: (visible: boolean) => void;
  children: JSX.Element;
}

function VisibilityManager(
  { children, onVisibilityChange, closeOnClickOutside = true, outsideClickIgnoreElements }: VisibilityManagerInterface,
  ref: React.Ref<VisibilityManagerContextInterface>,
) {
  const [visible, show, hide] = useBoolean(false);
  const toggle = useCallback(() => (visible ? hide() : show()), [hide, show, visible]);
  const context = React.useMemo<VisibilityManagerContextInterface>(
    () => ({ visible, show, hide, toggle }),
    [hide, show, toggle, visible],
  );

  useEffectSkipFirst(() => onVisibilityChange && onVisibilityChange(visible), [visible, onVisibilityChange]);
  React.useEffect(() => provideRef(ref)(context), [context, ref]);

  if (!closeOnClickOutside)
    return <VisibilityManagerContext.Provider value={context}>{children}</VisibilityManagerContext.Provider>;

  return (
    <VisibilityManagerContext.Provider value={context}>
      <HandleClickOutside onClickOutside={hide} ignoreElements={outsideClickIgnoreElements}>
        {children}
      </HandleClickOutside>
    </VisibilityManagerContext.Provider>
  );
}

export default React.memo(React.forwardRef(VisibilityManager));

export { VisibilityManagerContext } from "./context";
export type { VisibilityManagerContextInterface } from "./context";
