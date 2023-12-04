import React from "react";

export const demoComponents: { name: string; Component: React.FC }[] = [];

export function registerDemoComponent(name: string, Component: React.FC) {
  demoComponents.push({ name, Component });
}

export function sortRegisteredComponents() {
  demoComponents.sort((a, b) => (a.name > b.name ? 1 : -1));
}
