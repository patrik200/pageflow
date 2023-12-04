export interface BoxShadow {
  x?: number;
  y?: number;
  inset?: boolean;
  blur?: number;
  spread?: number;
  color: CSSVarFunction | string;
}

export function boxShadow({ x = 0, y = 0, blur = 0, spread = 0, inset, color }: BoxShadow) {
  return `${inset ? "inset " : ""}${x}px ${y}px ${blur}px ${spread}px ${color}`;
}

export function boxShadows(shadows: BoxShadow[]) {
  return shadows.map(boxShadow).join(",");
}
