function updateClock() {
  const now = new Date();
  document.getElementById("clock").textContent =
    now.toLocaleTimeString();
}

setInterval(updateClock, 1000);
updateClock();
function toggleFocus() {
  const content = document.getElementById("focusContent");
  content.style.display =
    content.style.display === "none" ? "block" : "none";
}