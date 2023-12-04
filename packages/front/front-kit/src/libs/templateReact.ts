import React, { isValidElement } from "react";
import { isString } from "@worksolutions/utils";

export function templateReact(text: string, keyMap: Record<string, React.ReactNode>) {
  const keys = Object.keys(keyMap);
  let tempText = [text] as React.ReactNode[];

  let keyIndex = 0;

  keys.forEach((key) => {
    tempText = tempText
      .map((text) => {
        if (!isString(text)) return text;

        const newTextPart = text.split(`{${key}}`);
        if (newTextPart.length === 1) return newTextPart;

        const result: React.ReactNode[] = [];
        newTextPart.forEach((text, i) => {
          result.push(text);
          if (i === newTextPart.length - 1) return;
          const element = keyMap[key];
          if (isValidElement(element)) {
            result.push(React.createElement(React.Fragment, { key: keyIndex }, element));
            keyIndex++;
          } else {
            result.push(element);
          }
        });
        return result;
      })
      .flat();
  });

  return tempText;
}
