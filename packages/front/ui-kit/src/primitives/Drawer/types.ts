import React from "react";

import { UseModalInterface } from "primitives/ModalInternal";

export type DrawerAppearancePosition = "left" | "right";

export interface DrawerInterface extends UseModalInterface {
  className?: string;
  children: React.ReactNode;
  appearancePosition: DrawerAppearancePosition;
}
