// Search: shows the Search button, which opens the search bar as a modal dialog over the
// header. Focus moves into the field; the close button and Escape close the bar, and focus
// returns to the Search button. The search itself is later work, so the form submits
// nothing and the results area stays empty. Without JavaScript the button stays hidden.
(() => {
  const search = document.querySelector("[data-search]");
  if (!search) return;
  const button = search.querySelector("[data-search-open]");
  const dialog = search.querySelector("[data-search-dialog]");
  const field = dialog.querySelector("input");

  button.addEventListener("click", () => {
    dialog.showModal();
    field.focus();
  });
  dialog.querySelector("[data-search-close]").addEventListener("click", () => dialog.close());
  dialog.querySelector("[data-search-form]").addEventListener("submit", (event) => event.preventDefault());
  // Escape closes a modal dialog by itself; either way, focus goes back to the button.
  dialog.addEventListener("close", () => button.focus());

  button.hidden = false;
})();
