import { range } from "@worksolutions/utils";

import { createPageLinkItem, createTriplePointItem } from "./libs";

export function getPaginationItemsForCurrentPageOnLeft(maxLinksCount: number, totalPages: number) {
  return [
    createPageLinkItem(1),
    ...range(2, maxLinksCount).map(createPageLinkItem),
    createTriplePointItem(maxLinksCount),
    createPageLinkItem(totalPages),
  ];
}
