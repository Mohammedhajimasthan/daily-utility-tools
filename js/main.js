// THEME TOGGLE
const toggle = document.getElementById("themeToggle");
const root = document.documentElement;

toggle.onclick = () => {
  const light = root.classList.toggle("light");
  localStorage.setItem("theme", light ? "light" : "dark");
};

if (localStorage.getItem("theme") === "light") {
  root.classList.add("light");
}

// SCROLL REVEAL
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add("show");
  });
}, { threshold: 0.15 });

document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
