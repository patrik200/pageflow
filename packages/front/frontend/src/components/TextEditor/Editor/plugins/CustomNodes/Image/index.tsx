import React from "react";
import type {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from "lexical";
import { $applyNodeReplacement, DecoratorNode } from "lexical";

function convertImageElement(domNode: Node): null | DOMConversionOutput {
  if (domNode instanceof HTMLImageElement) {
    const { src } = domNode;
    return { node: $createImageNode({ src }) };
  }
  return null;
}

export type SerializedImageNode = Spread<{ src: string }, SerializedLexicalNode>;

export class ImageNode extends DecoratorNode<React.JSX.Element> {
  __src: string;

  static getType(): string {
    return "image";
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(node.__src, node.__key);
  }

  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    const { src } = serializedNode;
    return $createImageNode({ src });
  }

  static importDOM(): DOMConversionMap | null {
    return { img: () => ({ conversion: convertImageElement, priority: 0 }) };
  }

  constructor(src: string, key?: NodeKey) {
    super(key);
    this.__src = src;
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement("img");
    element.setAttribute("src", this.__src);
    return { element };
  }

  exportJSON(): SerializedImageNode {
    return {
      src: this.getSrc(),
      type: "inline-image",
      version: 1,
    };
  }

  getSrc(): string {
    return this.__src;
  }

  createDOM(config: EditorConfig): HTMLElement {
    const span = document.createElement("span");
    const className = config.theme.image;
    if (className !== undefined) span.className = className;
    return span;
  }

  updateDOM(prevNode: ImageNode, dom: HTMLElement, config: EditorConfig): false {
    const className = config.theme.image;
    if (className !== undefined) dom.className = className;
    return false;
  }

  decorate(): React.JSX.Element {
    return <img src={this.getSrc()} />;
  }
}

export interface ImageNodePayload {
  src: string;
  key?: NodeKey;
}

export function $createImageNode({ src, key }: ImageNodePayload): ImageNode {
  return $applyNodeReplacement(new ImageNode(src, key));
}

export function $isImageNode(node: LexicalNode | null | undefined): node is ImageNode {
  return node instanceof ImageNode;
}
