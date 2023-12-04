import { identity, memoizeWith } from "@worksolutions/utils";

export const createFloatMask = memoizeWith(identity, function (this: any, symbolsCount: number) {
  return new Array(symbolsCount).fill("@").join("");
});

export const createIntMask = memoizeWith(identity, function (this: any, symbolsCount: number) {
  return new Array(symbolsCount).fill("&").join("");
});
