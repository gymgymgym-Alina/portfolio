console.log("IT'S ALIVE!");

export function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

/* --- Step 2: manual current-link detection ----------
   Superseded by Step 3, which builds the nav and sets .current itself.

const navLinks = $$("nav a");
const currentLink = navLinks.find(
  (a) => a.host === location.host && a.pathname === location.pathname
);
currentLink?.classList.add("current");
----------------------------*/

/* ---------- Step 3: automatic navigation menu ---------- */
const BASE_PATH =
  location.hostname === "localhost" || location.hostname === "127.0.0.1"
    ? "/"
    : "/portfolio/";

const pages = [
  { url: "", title: "Home" },
  { url: "projects/", title: "Projects" },
  { url: "contact/", title: "Contact" },
  { url: "cv/", title: "CV" },
  { url: "https://github.com/gymgymgym-Alina", title: "GitHub" },
];

const nav = document.createElement("nav");
document.body.prepend(nav);

for (const page of pages) {
  const url = page.url.startsWith("http") ? page.url : BASE_PATH + page.url;

  const a = document.createElement("a");
  a.href = url;
  a.textContent = page.title;

  const isExternal = a.host !== location.host;
  a.classList.toggle("current", !isExternal && a.pathname === location.pathname);
  if (isExternal) a.target = "_blank";

  nav.append(a);
}

/* ---------- Step 4: color scheme switcher ---------- */
document.body.insertAdjacentHTML(
  "afterbegin",
  `<label class="color-scheme">
     Theme:
     <select>
       <option value="light dark">Automatic</option>
       <option value="light">Light</option>
       <option value="dark">Dark</option>
     </select>
   </label>`
);

const select = document.querySelector(".color-scheme select");

function setColorScheme(scheme) {
  document.documentElement.style.setProperty("color-scheme", scheme);
  select.value = scheme;
  localStorage.colorScheme = scheme;
}

const osDark = matchMedia("(prefers-color-scheme: dark)");
const autoOption = select.querySelector('option[value="light dark"]');

function labelAutoOption() {
  autoOption.textContent = `Automatic (${osDark.matches ? "Dark" : "Light"})`;
}

labelAutoOption();
osDark.addEventListener("change", labelAutoOption);

setColorScheme(localStorage.colorScheme ?? "light dark");

select.addEventListener("input", (event) => setColorScheme(event.target.value));

/* ---------- Step 5: contact form ---------- */
const form = document.querySelector('form[action^="mailto:"]');

form?.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(form);
  const params = [];

  for (const [name, value] of data) {
    params.push(`${name}=${encodeURIComponent(value)}`);
  }

  location.href = `${form.action}?${params.join("&")}`;
});
