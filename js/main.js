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

const gitHubApiUrl = `https://api.github.com/users/${githubUsername}/repos?type=all&sort=updated&per_page=12`;

const projectStatus = 
  document.querySelector("#project-status");

const projectList =
  document.querySelector("#project-list");

const projectFilters =
    document.querySelector("#project-filters");

const languageCacheKey = `portfolio-language-usage:${githubUsername}`;
const languageCacheDurationMs = 30 * 60 * 1000;
const languageBatchSize = 3;

const setProjectStatus = (message) => {
    projectStatus.textContent = message;
};

let allProjects = [];

let selectedLanguage = "전체";
let languageLookupLimited = false;

const escapeHtml = (value) => {
    const temporaryElement =
        document.createElement("div");

    temporaryElement.textContent = value ?? "";
    
    return temporaryElement.innerHTML;
};

const normalizeLanguageUsage = (languageBytes) => {
    if (!languageBytes || typeof languageBytes !== "object" || Array.isArray(languageBytes)) {
        return [];
    }

    const entries = Object.entries(languageBytes)
      .filter(([, bytes]) => Number.isFinite(bytes) && bytes > 0)
      .sort(([, leftBytes], [, rightBytes]) => rightBytes - leftBytes);

    const totalBytes = entries.reduce(
        (sum, [, bytes]) => sum + bytes,
        0
    );

    return entries.map(([name, bytes]) => ({
        name,
        bytes,
        percentage: (bytes / totalBytes) * 100,
    }));
};

const formatLanguageBytes = (bytes) => {
    if (bytes >= 1024 * 1024) {
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }

    if (bytes >= 1024) {
        return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${bytes} B`;
};

const formatLanguagePercentage = (percentage) =>
    percentage < 0.1 ? "0.1% 미만" : `${percentage.toFixed(1)}%`;

const getProjectLanguages = (project) =>
    project.languageUsage.length > 0
      ? project.languageUsage.map(({ name }) => name)
      : [project.language || "기타"];

const renderLanguageUsage = ({ languageUsage, languageStatus, language }) => {
    if (languageStatus === "loading") {
        return '<p class="project-language-note">언어 사용량을 불러오는 중...</p>';
    }

    if (languageStatus === "error") {
        return `<p class="project-language-note">상세 언어 정보를 불러오지 못했습니다. 대표 언어: ${escapeHtml(language || "미지정")}</p>`;
    }

    if (languageUsage.length === 0) {
        return '<p class="project-language-note">분석된 언어가 없습니다.</p>';
    }

    const usageItems = languageUsage.map(({ name, bytes, percentage }) => `
      <li>
        <div class="project-language-row">
          <span>${escapeHtml(name)}</span>
          <span>${escapeHtml(formatLanguagePercentage(percentage))} · ${formatLanguageBytes(bytes)}</span>
        </div>
        <progress class="project-language-bar" max="100" value="${percentage.toFixed(2)}" aria-hidden="true"></progress>
      </li>
    `).join("");

    return `
      <div class="project-languages">
        <h4>언어 사용량${languageStatus === "stale" ? " (저장된 정보)" : ""}</h4>
        <ul>${usageItems}</ul>
      </div>
    `;
};

const createProjectCard = ({
    name,
    description,
    html_url: repositoryUrl,
    language,
    stargazers_count: stars,
    languageUsage,
    languageStatus,
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
            <span>대표 언어: ${safeLanguage}</span>
            <span>⭐ ${stars}</span>
        </div>

        ${renderLanguageUsage({ languageUsage, languageStatus, language })}

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
        ...new Set(allProjects.flatMap(getProjectLanguages)),
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
            (project) =>
              getProjectLanguages(project).includes(selectedLanguage)
        );

    const unavailableCount = allProjects.filter(
        ({ languageStatus }) => languageStatus === "error"
    ).length;
    const staleCount = allProjects.filter(
        ({ languageStatus }) => languageStatus === "stale"
    ).length;
    let message = `${selectedLanguage}: ${filteredProjects.length}개의 프로젝트를 표시합니다.`;

    if (unavailableCount > 0) {
        message += ` ${unavailableCount}개의 저장소는 상세 언어 정보를 불러오지 못했습니다.`;
    }

    if (staleCount > 0) {
        message += ` ${staleCount}개의 저장소는 저장된 언어 정보를 표시합니다.`;
    }

    if (languageLookupLimited) {
        message += " GitHub 요청 제한으로 추가 조회를 중단했습니다.";
    }

    setProjectStatus(message);

    renderProjects(filteredProjects);
};

const readLanguageCache = () => {
    try {
        const cached = JSON.parse(localStorage.getItem(languageCacheKey) || "{}");
        return cached && typeof cached === "object" && !Array.isArray(cached)
          ? cached
          : {};
    } catch (error) {
        console.warn("언어 캐시를 읽지 못했습니다.", error);
        return {};
    }
};

const writeLanguageCache = (cache) => {
    try {
        localStorage.setItem(languageCacheKey, JSON.stringify(cache));
    } catch (error) {
        console.warn("언어 캐시를 저장하지 못했습니다.", error);
    }
};

const fetchRepositoryLanguages = async (repository) => {
    const owner = encodeURIComponent(repository.owner.login);
    const name = encodeURIComponent(repository.name);
    const response = await fetch(
        `https://api.github.com/repos/${owner}/${name}/languages`,
        { headers: { Accept: "application/vnd.github+json" } }
    );

    if (!response.ok) {
        const error = new Error(`언어 API 오류: ${response.status}`);
        error.status = response.status;
        throw error;
    }

    const languageBytes = await response.json();

    if (!languageBytes || typeof languageBytes !== "object" || Array.isArray(languageBytes)) {
        throw new Error("언어 API 응답 형식이 올바르지 않습니다.");
    }

    return languageBytes;
};

const loadProjectLanguageUsage = async () => {
    const cache = readLanguageCache();
    const pendingProjects = [];
    const cachedProjects = new Set();

    allProjects.forEach((project) => {
        const cached = cache[project.full_name];
        const cacheMatches = cached &&
          cached.pushedAt === project.pushed_at &&
          cached.languageBytes &&
          typeof cached.languageBytes === "object" &&
          !Array.isArray(cached.languageBytes);

        if (cacheMatches) {
            cachedProjects.add(project.full_name);
            project.languageUsage = normalizeLanguageUsage(cached.languageBytes);

            const cacheAge = Date.now() - cached.fetchedAt;
            if (cacheAge >= 0 && cacheAge < languageCacheDurationMs) {
                project.languageStatus = "loaded";
                return;
            }
        }

        pendingProjects.push(project);
    });

    for (let offset = 0; offset < pendingProjects.length; offset += languageBatchSize) {
        const batch = pendingProjects.slice(offset, offset + languageBatchSize);
        const results = await Promise.allSettled(batch.map(fetchRepositoryLanguages));

        results.forEach((result, index) => {
            const project = batch[index];

            if (result.status === "fulfilled") {
                project.languageUsage = normalizeLanguageUsage(result.value);
                project.languageStatus = "loaded";
                cache[project.full_name] = {
                    pushedAt: project.pushed_at,
                    fetchedAt: Date.now(),
                    languageBytes: result.value,
                };
            } else {
                console.warn(`${project.full_name} 언어 조회 실패`, result.reason);
                project.languageStatus = cachedProjects.has(project.full_name)
                  ? "stale"
                  : "error";

                if (result.reason?.status === 403 || result.reason?.status === 429) {
                    languageLookupLimited = true;
                }
            }
        });

        if (languageLookupLimited) {
            break;
        }
    }

    allProjects.forEach((project) => {
        if (project.languageStatus === "loading") {
            project.languageStatus = cachedProjects.has(project.full_name)
              ? "stale"
              : "error";
        }
    });

    writeLanguageCache(cache);
};

const loadGitHubProjects = async () => {
    setProjectStatus("프로젝트를 불러오는 중...");
    projectList.replaceChildren();
    projectFilters.replaceChildren();
    languageLookupLimited = false;

    try {
        const response = await fetch(gitHubApiUrl);

        if (!response.ok) {
            throw new Error(
                `GitHub API 오류: ${response.status}`
            );
        }

        const projects = await response.json();

        allProjects = projects.map((project) => ({
            ...project,
            languageUsage: [],
            languageStatus: "loading",
        }));

        if (allProjects.length === 0) {
            setProjectStatus(
                "표시할 프로젝트가 없습니다."
            );
            return;
        }

        setProjectStatus(
            `${allProjects.length}개의 프로젝트를 찾았습니다. 언어 사용량을 불러오는 중...`
        );
        renderProjects(allProjects);

        await loadProjectLanguageUsage();

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
