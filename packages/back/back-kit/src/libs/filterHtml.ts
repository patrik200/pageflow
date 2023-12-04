import createDOMPurify from "dompurify";
import { JSDOM } from "jsdom";

export const filterHtml = (html: string) => {
  const window = new JSDOM("").window;
  const DOMPurify = createDOMPurify(window);
  return DOMPurify.sanitize(html);
};
