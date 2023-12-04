export function dynamicImportFixDefault<DEFAULT, MODULE extends { default: DEFAULT }>(
  promise: Promise<MODULE>,
): Promise<MODULE> {
  return promise.then((value) => {
    if (value.default && (value.default as any).default) return { ...value, default: (value.default as any).default };
    return value as any;
  });
}
