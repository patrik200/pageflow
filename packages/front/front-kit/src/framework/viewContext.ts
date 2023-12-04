import React from "react";
import { ContainerInstance } from "typedi";

export interface ViewContextInterface {
  containerInstance: ContainerInstance;
}

export const ViewContext = React.createContext<ViewContextInterface>(null!);

export function useViewContext() {
  return React.useContext(ViewContext);
}
