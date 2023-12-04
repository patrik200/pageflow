function parseReferenceString(referenceString: string) {
  const splittedReferenceString = [...referenceString.matchAll(/{[a-zA-Z0-9_!,+./?&=@-]+}/g)];
  if (splittedReferenceString.length === 0)
    return [
      {
        index: -1,
        name: "",
        after: referenceString,
        excludeValuesInsteadOfKey: [] as string[],
        excludeValuesAfterKey: [] as string[],
      },
    ];

  const parsedReferenceString = splittedReferenceString.map((match, arrayIndex) => {
    const nextMatch = splittedReferenceString[arrayIndex + 1];
    const [rawMatchText] = match;

    let matchText = rawMatchText.slice(1, -1);
    const excludeValuesInsteadOfKey: string[] = [];
    const excludeValuesAfterKey: string[] = [];

    if (matchText.includes("@")) {
      const [key, excludeValuesStringAndMaybeExclamationPoint] = matchText.split("@");
      const [excludeValuesString, stringAfterExclamationPoint] = excludeValuesStringAndMaybeExclamationPoint.split("!");

      matchText = stringAfterExclamationPoint ? key + "!" + stringAfterExclamationPoint : key;
      excludeValuesAfterKey.push(...excludeValuesString.split(","));
    }

    if (matchText.includes("!")) {
      const [key, excludeValuesString] = matchText.split("!");
      matchText = key;
      excludeValuesInsteadOfKey.push(...excludeValuesString.split(","));
    }

    return {
      index: match.index!,
      name: matchText,
      excludeValuesInsteadOfKey,
      excludeValuesAfterKey,
      after: nextMatch
        ? referenceString.slice(match.index! + rawMatchText.length, nextMatch.index)
        : referenceString.slice(match.index! + rawMatchText.length),
    };
  });

  return [
    {
      index: -1,
      name: "",
      after: referenceString.slice(0, splittedReferenceString[0].index),
      excludeValuesInsteadOfKey: [] as string[],
      excludeValuesAfterKey: [] as string[],
    },
    ...parsedReferenceString,
  ];
}

export function matchStringsWithParams(referenceString: string) {
  const parsedReferenceString = parseReferenceString(referenceString);

  function match(valueString: string) {
    let valueStringTail = valueString;
    const result = parsedReferenceString
      .map(({ after, name, excludeValuesAfterKey, excludeValuesInsteadOfKey }) => {
        if (!name) {
          if (!valueStringTail.startsWith(after)) return false;
          valueStringTail = valueStringTail.slice(after.length);
          return null;
        }

        const afterIndex = after === "" ? valueStringTail.length : valueStringTail.indexOf(after);
        if (afterIndex === -1) return false;
        const dynamicValue = valueStringTail.slice(0, afterIndex);

        if (detectExcludingInsteadOfDynamicValue(excludeValuesInsteadOfKey, dynamicValue)) return false;
        if (detectExcludingAfterDynamicValue(excludeValuesAfterKey, dynamicValue)) return false;

        valueStringTail = valueStringTail.slice(afterIndex + after.length);
        return { [name]: dynamicValue };
      })
      .filter((value) => value !== null);

    if (result.includes(false)) return false;
    if (result.length === 0 && valueStringTail.length !== 0) return false;
    return Object.assign({}, ...result) as Record<string, string>;
  }

  return {
    match,
    convertedReferenceString: parsedReferenceString
      .map(({ name, after }) => (name ? "{" + name + "}" : "" + after))
      .join(""),
  };
}

function detectExcludingInsteadOfDynamicValue(excludeValuesInsteadOfDynamicValue: string[], dynamicValue: string) {
  return excludeValuesInsteadOfDynamicValue.find((excludeValue) => {
    if (excludeValue.endsWith("+")) return dynamicValue.startsWith(excludeValue.slice(0, -1));
    return excludeValue === dynamicValue;
  });
}

function detectExcludingAfterDynamicValue(excludeValuesAfterDynamicValue: string[], dynamicValue: string) {
  return excludeValuesAfterDynamicValue.find((excludeValue) => {
    if (excludeValue.endsWith("+")) {
      const excludeValueWithoutPlus = excludeValue.slice(0, -1);
      const startIndex = dynamicValue.indexOf(excludeValueWithoutPlus);
      if (startIndex === -1) return false;
      return dynamicValue.slice(startIndex).startsWith(excludeValueWithoutPlus);
    }

    return dynamicValue.endsWith(excludeValue);
  });
}
