import React from "react";

import { Checkbox } from "main";

import { blockStyles, wrapperStyles } from "./style.css";

export function CheckboxesDemo() {
  return (
    <div className={wrapperStyles}>
      <div className={blockStyles}>
        <Checkbox value>One</Checkbox>
        <Checkbox value={false}>Two</Checkbox>
        <Checkbox value disabled>
          One disabled
        </Checkbox>
        <Checkbox value={false} disabled>
          Two disabled
        </Checkbox>
      </div>
      <div className={blockStyles}>
        <Checkbox radio value>
          One
        </Checkbox>
        <Checkbox radio value={false}>
          Two
        </Checkbox>
        <Checkbox radio value disabled>
          One disabled
        </Checkbox>
        <Checkbox radio value={false} disabled>
          Two disabled
        </Checkbox>
      </div>
    </div>
  );
}
