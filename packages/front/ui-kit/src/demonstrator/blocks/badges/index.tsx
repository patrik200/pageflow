import React from "react";

import { Badge, BadgeColorVariants } from "main";

import DemoGroup from "../../components/DemoGroup";

import { wrapperStyles } from "./style.css";

export function BadgesDemo() {
  return (
    <DemoGroup title="Badges">
      <div className={wrapperStyles}>
        <Badge text="info" icon="eyeOffLine" variant={BadgeColorVariants.INFO} />
        <Badge text="warning" icon="editorCodeView" variant={BadgeColorVariants.WARNING} />
        <Badge text="alarm" icon="logoutBoxLine" variant={BadgeColorVariants.ALARM} />
      </div>
    </DemoGroup>
  );
}
