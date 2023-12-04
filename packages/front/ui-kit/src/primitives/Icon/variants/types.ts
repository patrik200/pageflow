import { IconInterface } from "../index";

export type IconVariantProps<ICON> = Omit<IconInterface, "icon"> & {
  className?: string;
  icon: ICON;
};
