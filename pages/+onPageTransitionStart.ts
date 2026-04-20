// https://vike.dev/onPageTransitionStart

import type { PageContextClient } from "vike/types";

export async function onPageTransitionStart(pageContext: Partial<PageContextClient>) {
  console.log("Page transition start");
  document.body.classList.add("page-transition");
  window.dispatchEvent(new CustomEvent("vike:transition-start"));
}
