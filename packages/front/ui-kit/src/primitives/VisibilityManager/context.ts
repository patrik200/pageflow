import React from "react";

export interface VisibilityManagerContextInterface {
  visible: boolean;
  show: () => void;
  hide: () => void;
  toggle: () => void;
}

export const VisibilityManagerContext = React.createContext<VisibilityManagerContextInterface>(null!);
