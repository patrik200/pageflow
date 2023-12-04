import { $getSelection, $isRangeSelection } from "lexical";

export function getSelection() {
  const selection = $getSelection();
  if (!selection) return null;
  if ($isRangeSelection(selection)) return selection;
  return null;
}
