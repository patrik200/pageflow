import React from "react";

export type PropsWithRef<PROPS, REF> = PROPS & { ref?: React.Ref<REF> };
export type ComponentWithRef<BASIC_PROPS, REF> = React.FC<PropsWithRef<BASIC_PROPS, REF>>;
export type ComponentWithRefAndProps<BASIC_PROPS, ADDITIONAL_PROPS, REF> = ComponentWithRef<
  BASIC_PROPS & ADDITIONAL_PROPS,
  REF
>;
