import React from "react";
import { observer } from "mobx-react-lite";
import { Typography } from "@app/ui-kit";
import cn from "classnames";

import {
  childrenWrapperStyles,
  requiredAsteriskStyles,
  titleDirectionColumnStyleVariants,
  titleDirectionRowStyleVariants,
  titleStyles,
  wrapperDirectionStyleVariants,
  wrapperStyles,
} from "./style.css";

export type FormFieldWrapperDirection = "row" | "column";

interface FormFieldWrapperInterface {
  className?: string;
  required?: boolean;
  title?: string;
  children: React.ReactNode;
  direction?: FormFieldWrapperDirection;
  mode: "edit" | "view";
}

function FormFieldWrapper({
  className,
  required,
  title,
  direction = "row",
  mode,
  children,
}: FormFieldWrapperInterface) {
  return (
    <div className={cn(className, wrapperStyles, wrapperDirectionStyleVariants[direction])}>
      {title && (
        <Typography
          className={cn(
            titleStyles,
            direction === "row" ? titleDirectionRowStyleVariants[mode] : titleDirectionColumnStyleVariants[mode],
          )}
        >
          {title}
          {required && <Typography className={requiredAsteriskStyles}>*</Typography>}
        </Typography>
      )}
      <div className={childrenWrapperStyles}>{children}</div>
    </div>
  );
}

export default observer(FormFieldWrapper);
