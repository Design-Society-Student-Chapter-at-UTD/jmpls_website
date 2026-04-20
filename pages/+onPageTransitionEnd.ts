export async function onPageTransitionEnd() {
  console.log("Page transition end");
  document.body.classList.remove("page-transition");
  window.dispatchEvent(new CustomEvent("vike:transition-end"));
}
