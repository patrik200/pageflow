export function getVariableNameFromCssVarFunction(variable: CSSVarFunction) {
  return variable.slice(4, -1);
}
