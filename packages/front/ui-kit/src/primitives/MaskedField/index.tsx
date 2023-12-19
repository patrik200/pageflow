import React from "react";
import ReactInputMaskComponent from "react-input-mask";
import { omit } from "@worksolutions/utils";

import TextField, { TextFieldInterface } from "primitives/TextField";

import { ComponentWithRef } from "types";

import { formatValue as libFormatValue, parseMask as libParseMask } from "./internal/lib";

export type MaskedFieldWithoutMaskConfigInterface = Omit<TextFieldInterface, "onChange"> & {
  alwaysShowMask?: boolean;
  renderAsSimpleTextField?: boolean;
};

export type MaskedFieldInterface = MaskedFieldWithoutMaskConfigInterface & MaskParserConfigInterface;

export interface MaskParserConfigInterface {
  mask: string;
  maskCharacter?: string | null;
  formatCharacters?: Record<string, string>;
}

export const defaultMaskFormatChars = {
  "&": "[0-9]",
  "@": "[0-9.]",
  "!": "[A-Fa-f0-9]",
  "#": "[A-Za-z]",
};

export interface MaskParserResultInterface {
  maskChar: MaskParserConfigInterface["maskCharacter"];
  formatChars: MaskParserConfigInterface["formatCharacters"];
  prefix: string | null;
  mask: string | null;
  lastEditablePosition: number | null;
  permanents: number[];
}

export function parseMask({
  mask,
  maskCharacter = null,
  formatCharacters = defaultMaskFormatChars,
}: MaskParserConfigInterface): MaskParserResultInterface {
  return libParseMask(mask, maskCharacter, formatCharacters);
}

export function formatMaskedValue(maskParserResult: MaskParserResultInterface, value: string) {
  return libFormatValue(maskParserResult, value);
}

function MaskedField(
  {
    mask,
    maskCharacter = null,
    alwaysShowMask = false,
    formatCharacters = defaultMaskFormatChars,
    renderAsSimpleTextField,
    ...props
  }: MaskedFieldInterface,
  ref: React.Ref<HTMLDivElement>,
) {
  const maskedInput = React.useMemo(
    () =>
      React.forwardRef((props: Record<string, any>, ref: React.Ref<any>) => (
        <ReactInputMaskComponent
          inputRef={ref}
          {...omit(["fieldType", "error"], props)}
          mask={mask}
          formatChars={formatCharacters}
          maskChar={maskCharacter}
          alwaysShowMask={alwaysShowMask}
        />
      )),
    [alwaysShowMask, formatCharacters, maskCharacter, mask],
  );

  return <TextField {...props} ref={ref} as={renderAsSimpleTextField ? undefined : maskedInput} />;
}

export default React.memo(React.forwardRef(MaskedField)) as ComponentWithRef<MaskedFieldInterface, HTMLDivElement>;
