import React from "react";

import { PermissionRendererValue } from "./types";

import PermissionRendererAdded from "./Added";

import { wrapperStyles } from "./style.css";

interface PermissionRendererInterface {
  value: PermissionRendererValue[] | null;
  mode: "from" | "to";
}

function PermissionRenderer({ value, mode }: PermissionRendererInterface) {
  if (!value) return null;
  if (value.length === 0) return null;

  return (
    <div className={wrapperStyles}>
      {mode === "to" &&
        value.map((rendererValue, key) => <PermissionRendererAdded key={key} rendererValue={rendererValue} />)}
    </div>
  );
}

const PermissionRendererDefault = React.memo(PermissionRenderer);
(PermissionRendererDefault as any).hideSeparator = true;
export default PermissionRendererDefault;
