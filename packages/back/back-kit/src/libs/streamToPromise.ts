const stp = require("stream-to-promise");

export function streamToPromise<RESULT = any>(stream: NodeJS.ReadableStream): Promise<RESULT> {
  return stp(stream);
}
