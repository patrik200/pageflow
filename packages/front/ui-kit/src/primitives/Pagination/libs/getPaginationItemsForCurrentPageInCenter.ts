import { range } from "@worksolutions/utils";

import { createPageLinkItem, createTriplePointItem } from "./libs";

const TRIPLE_POINTS_ITEMS_COUNT = 2;
const FIRST_PAGE_ITEM = 1;
const CURRENT_PAGE_ITEM = 1;

const INTERNAL_PAGINATION_ITEMS_COUNT = TRIPLE_POINTS_ITEMS_COUNT + FIRST_PAGE_ITEM + CURRENT_PAGE_ITEM;

export function getPaginationItemsForCurrentPageInCenter(
  currentPage: number,
  maxLinksCount: number,
  totalPages: number,
) {
  const notInternalItemsCount = maxLinksCount - INTERNAL_PAGINATION_ITEMS_COUNT;
  const halfOfNotInternalItemsCount = notInternalItemsCount / 2;

  const leftNotInternalItemsCount = Math.floor(halfOfNotInternalItemsCount);
  const rightNotInternalItemsCount = Math.ceil(halfOfNotInternalItemsCount);

  const leftPagesStartsWith = currentPage - leftNotInternalItemsCount;
  const leftPagesEndsWith = currentPage;

  const rightPagesStartsWith = currentPage + 1;
  const rightPagesEndsWith = rightPagesStartsWith + rightNotInternalItemsCount;

  return [
    createPageLinkItem(1),
    createTriplePointItem(leftPagesStartsWith - 1),
    ...range(leftPagesStartsWith, leftPagesEndsWith).map(createPageLinkItem),
    createPageLinkItem(currentPage),
    ...range(rightPagesStartsWith, rightPagesEndsWith).map(createPageLinkItem),
    createTriplePointItem(rightPagesEndsWith),
    createPageLinkItem(totalPages),
  ];
}
