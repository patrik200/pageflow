import React, { Fragment } from "react";

function createTags(images: string[]) {
  const appleTouch = images.filter((image) => image.startsWith("apple-touch"));
  const coast = images.filter((image) => image.startsWith("coast"));
  const favicon = images.filter((image) => image.startsWith("favicon"));

  const result: React.JSX.Element[] = [];

  appleTouch.forEach((name) => {
    const splittedName = name.split("-");
    if (splittedName.length !== 4) return;
    const size = splittedName[splittedName.length - 1].split(".")[0];
    result.push(<link rel="apple-touch-icon" sizes={size} href={`/favicon/apple-touch-icon-${size}.png`} />);
  });

  if (coast[0]) result.push(<link rel="icon" type="image/png" sizes="228x228" href={`/favicon/${coast[0]}`} />);

  favicon.forEach((name) => {
    const splittedName = name.split("-");
    if (splittedName.length === 1) {
      result.push(<link rel="icon" href={`/favicon/${name}`} />);
      return;
    }
    const size = splittedName[splittedName.length - 1].split(".")[0];
    result.push(<link rel="icon" type="image/png" sizes={size} href={`/favicon/${name}`} />);
  });

  return result;
}

async function getFavicon(projectDir: string, readdir: (path: string[]) => Promise<string[]>) {
  if (process.env.NODE_ENV !== "production") return null;
  const rawDir = await readdir([projectDir, ".next", "favicon"]);
  const justImages = rawDir.filter((name) => name.endsWith(".png") || name.endsWith(".svg") || name.endsWith(".ico"));
  return createTags(justImages);
}

export const nextFaviconGenerator = {
  element: [<Fragment key={0} />],
  generate: function (projectDir: string, readdir: (path: string[]) => Promise<string[]>) {
    getFavicon(projectDir, readdir).then((elements) => {
      if (!elements) return;
      elements.forEach((e, key) => (e.key = key));
      nextFaviconGenerator.element = elements;
    });
  },
};
