export function amount(
  {
    currency,
    language,
    maximumFractionDigits = 8,
  }: { currency: string; language: string; maximumFractionDigits?: number },
  value: string | number,
) {
  if (!currency) return prepareInput(value).toString();
  const numberFormat = new Intl.NumberFormat(language, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits,
  });
  return numberFormat.format(prepareInput(value));
}

export function decimalNumberFormat(
  { language }: { language: string },
  value: string | number,
  {
    minimumFractionDigits = 0,
    maximumFractionDigits = 8,
  }: { minimumFractionDigits?: number; maximumFractionDigits?: number } = {},
) {
  const numberFormat = new Intl.NumberFormat(language, {
    style: "decimal",
    minimumFractionDigits,
    maximumFractionDigits,
  });
  return numberFormat.format(prepareInput(value));
}

function prepareInput(value: string | number) {
  return parseFloat(value.toString().replace(",", "."));
}
