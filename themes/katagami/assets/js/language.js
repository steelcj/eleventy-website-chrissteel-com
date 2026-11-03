// The Language button: a disclosure that shows and hides the list of languages below it.
// Escape closes the list and returns focus to the button; a click or focus anywhere else
// closes it too. Without JavaScript the button stays hidden and the list shows as links.
(() => {
  const nav = document.querySelector("[data-language]");
  if (!nav) return;
  const button = nav.querySelector("[data-language-toggle]");
  const list = document.getElementById(button.getAttribute("aria-controls"));
  const isOpen = () => button.getAttribute("aria-expanded") === "true";
  const show = (open) => {
    button.setAttribute("aria-expanded", String(open));
    list.hidden = !open;
  };

  button.addEventListener("click", () => show(!isOpen()));
  nav.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isOpen()) {
      show(false);
      button.focus();
    }
  });
  document.addEventListener("click", (event) => {
    if (isOpen() && !nav.contains(event.target)) show(false);
  });
  nav.addEventListener("focusout", (event) => {
    if (isOpen() && event.relatedTarget && !nav.contains(event.relatedTarget)) show(false);
  });

  show(false);
  nav.dataset.enhanced = "";
  button.hidden = false;
})();
