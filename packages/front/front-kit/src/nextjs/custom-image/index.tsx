import React from "react";
import Head from "next/head";
import { LazyLoadImage } from "react-lazy-load-image-component";

export interface ImageInterface {
  className?: string;
  src: string;
  alt?: string;
  lazy?: boolean;
  lazyThreshold?: number;
  preload?: boolean;
}

function ImageComponent({ className, src, alt, lazy = true, lazyThreshold, preload }: ImageInterface) {
  return (
    <>
      {lazy ? (
        <LazyLoadImage className={className} threshold={lazyThreshold} alt={alt} decoding="async" src={src} />
      ) : (
        <img className={className} alt={alt} decoding="async" src={src} />
      )}
      {preload && (
        <Head>
          <link key={"preload_" + src} rel="preload" as="image" href={src} />
        </Head>
      )}
    </>
  );
}

export const Image = React.memo(ImageComponent);
