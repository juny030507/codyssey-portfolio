document.documentElement.classList.add("js");

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


const revealElements = 
  document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
    (entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
        });
    },
    {
        threshold: 0.2,
    }
);

revealElements.forEach((element) => {
    revealObserver.observe(element);
});

const contactForm = 
  document.querySelector("#contact-form");

const nameInput =
    document.querySelector("#name");

const emailInput =
    document.querySelector("#email");

const messageInput =
    document.querySelector("#message");

const nameError =
    document.querySelector("#name-error");

const emailError =
    document.querySelector("#email-error");

const messageError =
    document.querySelector("#message-error");

const formResult = 
    document.querySelector("#form-result");


const showFieldError = (
    input,
    errorElement,
    message
) => {
    input.classList.add("is-invalid");
    input.setAttribute("aria-invalid", "true");
    errorElement.textContent = message;
};

const clearFieldError = (
    input,
    errorElement
) => {
    input.classList.remove("is-invalid");
    input.setAttribute("aria-invalid", "false");
    errorElement.textContent = "";
};

const validateContactForm = () => {
    let isFormValid = true;

    clearFieldError(nameInput, nameError);
    clearFieldError(emailInput, emailError);
    clearFieldError(messageInput, messageError);

    if (nameInput.value.trim() === "") {
        showFieldError(
            nameInput,
            nameError,
            "이름을 입력해주세요."
        );
        isFormValid = false;
    }

    if (emailInput.value.trim() === "") {
        showFieldError(
            emailInput,
            emailError,
            "이메일을 입력해주세요."
        );
        isFormValid = false;
    } else if (emailInput.validity.typeMismatch) {
        showFieldError(
            emailInput,
            emailError,
            "올바른 이메일 주소를 입력해주세요."
        );

        isFormValid = false;
    }

    if (messageInput.value.trim() === "") {
        showFieldError(
            messageInput,
            messageError,
            "메시지를 입력해주세요."
        );
        isFormValid = false;
    }

    return isFormValid;
};

contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    formResult.textContent = "";
    formResult.classList.remove("error", "success");

    const isFormValid = validateContactForm();

    if (!isFormValid) {
        formResult.textContent = 
        "입력 내용을 다시 확인해주세요.";

        formResult.classList.add("error");
        return;
    }

    formResult.textContent =
      "메시지가 성공적으로 작성되었습니다.";

    formResult.classList.add("success");
    
    contactForm.reset();
});

const formFields = [
    {
        input: nameInput,
        error: nameError,
    },
    {
        input: emailInput,
        error: emailError,
    },
    {
        input: messageInput,
        error: messageError,
    },
];

formFields.forEach(({ input, error }) => {
    input.addEventListener("input", () => {
        clearFieldError(input, error);

        formResult.textContent = "";
        formResult.classList.remove(
            "error",
            "success"
        );
    });
});
