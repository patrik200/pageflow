import React from "react";

export type AsComponent<PROPS extends Record<string, any>> = keyof JSX.IntrinsicElements | React.FC<Omit<PROPS, "as">>;
