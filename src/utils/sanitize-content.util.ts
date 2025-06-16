import { JSDOM } from 'jsdom';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const createDOMPurify = require('dompurify');

export function sanitizeContent(content: string): string {
  const window = new JSDOM('').window;
  const DOMPurify = createDOMPurify(window);
  return DOMPurify.sanitize(content);
}
