const startText = "// replace-conditional-block-plugin-start ";
const endText = "// replace-conditional-block-plugin-end";

function getStartEnd(text, startText, endText) {
  const startIndex = text.indexOf(startText);
  if (startIndex === -1) return null;
  const endIndex = text.indexOf(endText, startIndex);
  if (endIndex === -1) throw new Error("Block is not ending");
  return { startIndex, endIndex: endIndex + endText.length };
}

function processCondition(text, format) {
  const resultStartText = startText + format;
  const resultEndText = endText;

  const indexes = getStartEnd(text, resultStartText, resultEndText);
  if (!indexes) return { text, replaced: false };
  text =
    text.slice(0, indexes.startIndex) +
    text
      .slice(indexes.startIndex + resultStartText.length, indexes.endIndex - resultEndText.length)
      .replaceAll("// ", "") +
    text.slice(indexes.endIndex);

  return { text, replaced: true };
}

module.exports.replaceConditionalBlockPlugin = function () {
  return {
    name: "replaceConditionalBlock",
    renderChunk(code, chunk, options) {
      if (options.format === "cjs") {
        while (true) {
          const { text, replaced } = processCondition(code, "cjs");
          if (!replaced) break;
          code = text;
        }
      }

      if (options.format === "es") {
        while (true) {
          const { text, replaced } = processCondition(code, "es");
          if (!replaced) break;
          code = text;
        }
      }

      return { code, map: null };
    },
  };
};
