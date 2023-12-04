import { UpdateFileRequestResult } from "core/storages/_common/updateFile";

export function prepareTextEditorHtmlToSave(
  html: string,
  results: { uploadResults: UpdateFileRequestResult[]; deleteResults?: UpdateFileRequestResult[] },
) {
  const dom = new DOMParser().parseFromString(html, "text/html");

  function prepareUrl(url: string) {
    if (!url.startsWith("blob:")) return url;
    const [, id] = url.split("#");
    if (!id) return url;
    return "#" + id;
  }

  dom.querySelectorAll("img").forEach((img) => (img.src = prepareUrl(img.src)));

  results.uploadResults.forEach((result) => {
    if (result.status !== "ok" || result.cause !== "upload") return;
    dom.querySelectorAll("img").forEach((img) => {
      if (!img.src.includes(result.uploadableFile.id)) return;
      img.src = result.file.url;
    });
  });

  results.deleteResults?.forEach((result) => {
    if (result.status !== "ok" || result.cause !== "delete") return;
    dom.querySelectorAll("img").forEach((img) => {
      if (!img.src.includes(result.deletableFile.id)) return;
      img.remove();
    });
  });

  return dom.body.innerHTML;
}
