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

const typingText = document.querySelector(".typing-text");
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
);

if (!prefersReducedMotion.matches) {
  const characters = Array.from(typingText.textContent);
  let characterIndex = 0;

  typingText.textContent = "";

  const typeNextCharacter = () => {
    typingText.textContent += characters[characterIndex];
    characterIndex += 1;

    if (characterIndex < characters.length) {
      window.setTimeout(typeNextCharacter, 85);
    } else {
      typingText.classList.add("typing-complete");
    }
  };

  typeNextCharacter();
} else {
  typingText.classList.add("typing-complete");
}


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

const submitButton =
    document.querySelector("#submit-button");

const setFormResult = (message, state) => {
    formResult.textContent = message;
    formResult.classList.remove("error", "success");

    if (state) {
        formResult.classList.add(state);
    }
};


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

contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (submitButton.disabled) {
        return;
    }

    setFormResult("");

    const isFormValid = validateContactForm();

    if (!isFormValid) {
        setFormResult("입력 내용을 다시 확인해주세요.", "error");
        contactForm.querySelector(".is-invalid")?.focus();
        return;
    }

    const formId = contactForm.dataset.formspreeId;

    if (!formId) {
        setFormResult(
            "문의 전송 설정을 마무리하는 중입니다. 잠시 후 다시 시도해주세요.",
            "error"
        );
        return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "전송 중...";
    contactForm.setAttribute("aria-busy", "true");
    setFormResult("메시지를 전송하는 중입니다.");

    try {
        const response = await fetch(
            `https://formspree.io/f/${formId}`,
            {
                method: "POST",
                body: new FormData(contactForm),
                headers: {
                    Accept: "application/json",
                },
            }
        );

        if (!response.ok) {
            throw new Error(
                `Formspree 오류: ${response.status}`
            );
        }

        setFormResult("메시지가 전송되었습니다. 감사합니다!", "success");
        contactForm.reset();
    } catch (error) {
        console.error(error);
        setFormResult(
            "메시지를 전송하지 못했습니다. 잠시 후 다시 시도해주세요.",
            "error"
        );
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = "보내기";
        contactForm.removeAttribute("aria-busy");
    }
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
        setFormResult("");
    });
});

const githubUsername = "juny030507";

const gitHubApiUrl = `https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=12`;

const projectStatus = 
  document.querySelector("#project-status");

const projectList =
  document.querySelector("#project-list");

const projectFilters =
    document.querySelector("#project-filters");

const setProjectStatus = (message) => {
    projectStatus.textContent = message;
};

let allProjects = [];

let selectedLanguage = "전체";

const escapeHtml = (value) => {
    const temporaryElement =
        document.createElement("div");

    temporaryElement.textContent = value ?? "";
    
    return temporaryElement.innerHTML;
};

const createProjectCard = ({
    name,
    description,
    html_url: repositoryUrl,
    language,
    stargazers_count: stars,
}) => {
    const safeName = escapeHtml(name);

    const safeDescription = escapeHtml(
        description || "등록된 설명이 없습니다."
    );

    const safeLanguage = escapeHtml(
        language || "기타"
    );
    const safeRepositoryUrl = escapeHtml(repositoryUrl);

    return `
      <article class="project-card">
        <h3>${safeName}</h3>

        <p>${safeDescription}</p>

        <div class="project-meta">
            <span>${safeLanguage}</span>
            <span>⭐ ${stars}</span>
        </div>

        <a
          class="project-link"
          href="${safeRepositoryUrl}"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="${safeName} GitHub 저장소 새 탭에서 열기"
        >
          저장소 보기
        </a>
      </article>
      `;
};

const renderProjects = (projects) => {
    const cardsHtml = projects
      .map(createProjectCard)
      .join("");
    projectList.innerHTML = cardsHtml;
};

const renderLanguageFilters = () => {
    const languages = [
        "전체",
        ...new Set(
            allProjects.map(
                ({language}) => language || "기타"
            )
        ),
    ];

    projectFilters.replaceChildren();

    languages.forEach((language) => {
        const button = document.createElement("button");

        button.type = "button";
        button.className = "project-filter-button";
        button.textContent = language;
        button.dataset.language = language;
        projectFilters.append(button);
    });

    updateLanguageFilterButtons();
};

const updateLanguageFilterButtons = () => {
    projectFilters
      .querySelectorAll(".project-filter-button")
      .forEach((button) => {
          const isSelected =
            button.dataset.language === selectedLanguage;

          button.classList.toggle("active", isSelected);
          button.setAttribute("aria-pressed", String(isSelected));
      });
};

projectFilters.addEventListener("click", (event) => {
    const button = event.target.closest(".project-filter-button");

    if (!button || !projectFilters.contains(button)) {
        return;
    }

    selectedLanguage = button.dataset.language;
    updateLanguageFilterButtons();
    renderFilteredProjects();
});

const renderFilteredProjects = () => {
    const filteredProjects =
      selectedLanguage === "전체"
        ? allProjects
        : allProjects.filter(
            ({ language }) =>
              (language || "기타") ===
              selectedLanguage
        );

    setProjectStatus(
        `${selectedLanguage}: ${filteredProjects.length}개의 프로젝트를 표시합니다.`
    );

    renderProjects(filteredProjects);
};

const loadGitHubProjects = async () => {
    setProjectStatus("프로젝트를 불러오는 중...");
    projectList.replaceChildren();
    projectFilters.replaceChildren();

    try {
        const response = await fetch(gitHubApiUrl);

        if (!response.ok) {
            throw new Error(
                `GitHub API 오류: ${response.status}`
            );
        }

        const projects = await response.json();

        allProjects = projects;

        if (allProjects.length === 0) {
            setProjectStatus(
                "표시할 프로젝트가 없습니다."
            );
            return;
        }

        selectedLanguage = "전체";
        renderLanguageFilters();
        renderFilteredProjects();

    } catch (error) {
        console.error(error);

        projectStatus.innerHTML = `
          <p>프로젝트를 불러올 수 없습니다.</p>

          <button
            class="retry-button"
            type="button"
          >
            다시 시도
          </button>
        `;

        const retryButton = 
          projectStatus.querySelector(
            ".retry-button"
          );

        retryButton.addEventListener(
            "click",
            loadGitHubProjects
        );
    }
};

loadGitHubProjects();
