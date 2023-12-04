export function typeormUpdateNullOrUndefined<VALUE extends string | number, KEY extends string = string>(
  value: VALUE | null | undefined,
  key: KEY,
  externalValue?: VALUE | null,
) {
  if (value === undefined) return undefined;
  if (value === null) return { [key]: null };
  return { [key]: { id: externalValue ?? value } };
}
