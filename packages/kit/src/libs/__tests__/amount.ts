import { nbspString } from "@worksolutions/utils";

import { amount, decimalNumberFormat } from "../amount";

test("amount test", () => {
  expect(amount({ currency: "RUB", language: "ru" }, 10000)).toEqual(`10${nbspString}000${nbspString}₽`);
  expect(amount({ currency: "RUB", language: "ru" }, 10000.01)).toEqual(`10${nbspString}000,01${nbspString}₽`);
  expect(amount({ currency: "RUB", language: "ru" }, 10000.05)).toEqual(`10${nbspString}000,05${nbspString}₽`);
  expect(amount({ currency: "RUB", language: "ru" }, 10000.1)).toEqual(`10${nbspString}000,1${nbspString}₽`);
  expect(amount({ currency: "RUB", language: "ru" }, 10000.15)).toEqual(`10${nbspString}000,15${nbspString}₽`);
  expect(amount({ currency: "RUB", language: "en" }, 10000)).toEqual(`RUB${nbspString}10,000`);
  expect(amount({ currency: "HUF", language: "hu" }, 300)).toEqual(`300${nbspString}Ft`);
  expect(amount({ currency: "HUF", language: "en" }, 300)).toEqual(`HUF${nbspString}300`);
  expect(amount({ currency: "HUF", language: "en" }, 300.9)).toEqual(`HUF${nbspString}300.9`);
  expect(amount({ currency: "UZS", language: "ru" }, 300)).toEqual(`300${nbspString}UZS`);
  expect(amount({ currency: "UZS", language: "uz" }, 300)).toEqual(`300${nbspString}soʻm`);
});

test("decimal number formats", () => {
  expect(decimalNumberFormat({ language: "ru" }, 0)).toEqual(`0`);
  expect(decimalNumberFormat({ language: "ru" }, 10)).toEqual(`10`);
  expect(decimalNumberFormat({ language: "ru" }, 1000)).toEqual(`1${nbspString}000`);
  expect(decimalNumberFormat({ language: "ru" }, 0.1)).toEqual(`0,1`);
  expect(decimalNumberFormat({ language: "ru" }, 0.0000001)).toEqual(`0,0000001`);
  expect(decimalNumberFormat({ language: "ru" }, 0.00000001)).toEqual(`0,00000001`);
  expect(decimalNumberFormat({ language: "ru" }, 0.000000001)).toEqual(`0`);
  expect(decimalNumberFormat({ language: "ru" }, 100.00000001)).toEqual(`100,00000001`);

  expect(decimalNumberFormat({ language: "ru" }, "12,4")).toEqual(`12,4`);
  expect(decimalNumberFormat({ language: "ru" }, "12.4")).toEqual(`12,4`);
});
