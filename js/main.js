const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(".nav-menu a");

let isMenuOpen = false;

const renderMenu = () => {
  navMenu.classList.toggle("active", isMenuOpen);

  menuToggle.setAttribute("aria-expanded", String(isMenuOpen));

  menuToggle.setAttribute(
    "aria-label",
    isMenuOpen ? "메뉴 닫기" : "메뉴 열기"
  );
};

menuToggle.addEventListener("click", () => {
  isMenuOpen = !isMenuOpen;
  renderMenu();
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    isMenuOpen = false;
    renderMenu();
  });
});

renderMenu();

const siteHeader = document.querySelector(".site-header");
const scrollTopButton = document.querySelector(".scroll-top");

const updateScrollUI = () => {
    const currentScrollY = window.scrollY;

    siteHeader.classList.toggle("scrolled", currentScrollY >= 60);
    scrollTopButton.classList.toggle("visible", currentScrollY >= 300);
}; 

window.addEventListener("scroll", updateScrollUI);

scrollTopButton.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

updateScrollUI();

const themeToggle = document.querySelector(".theme-toggle");

const  savedTheme = localStorage.getItem("theme");

const systemThemeQuery = window.matchMedia(
    "(prefers-color-scheme: dark)"
);

let currentTheme;

if (savedTheme) {
    currentTheme = savedTheme;
} else {
    currentTheme = systemThemeQuery.matches ? "dark" : "light";
}

const renderTheme = () => {
    const isDark = currentTheme === "dark";

    document.documentElement.setAttribute(
        "data-theme",
        currentTheme
    );

    themeToggle.textContent = isDark ? "☀️" : "🌙"
    
    themeToggle.setAttribute(
        "aria-label",
        isDark ? "라이트 모드로 전환" : "다크 모드로 전환"
    );
};

themeToggle.addEventListener("click", () => {
    currentTheme = 
      currentTheme === "dark" ? "light" : "dark";
    
    localStorage.setItem("theme", currentTheme);

    renderTheme();
});

systemThemeQuery.addEventListener("change", (event) => {
    const hasSavedTheme = localStorage.getItem("theme");

    if (hasSavedTheme) {
        return;
    }

    currentTheme = event.matches ? "dark" : "light";
    renderTheme();
});

renderTheme();
