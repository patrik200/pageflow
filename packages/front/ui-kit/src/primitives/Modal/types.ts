import React from "react";

import { UseModalInterface } from "primitives/ModalInternal";

export interface ModalInterface extends UseModalInterface {
  outerClassName?: string;
  className?: string;
  children: React.ReactNode;
  renderCloseButton?: boolean;
  beforeContent?: React.ReactNode;
  afterContent?: React.ReactNode;
  closeOnClickOutside?: boolean;
}
