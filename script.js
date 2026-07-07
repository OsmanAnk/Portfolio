function openBurgerMenu() {
    const menu = document.getElementById("navbar");
    const burgerButton = document.getElementById("burger-menu");

    if (!menu || !burgerButton) {
        return;
    }

    menu.classList.add("navbar-open");
    burgerButton.classList.add("menu-open");
    burgerButton.setAttribute("aria-expanded", "true");
    document.body.classList.add("menu-is-open");
}

function closeBurgerMenu() {
    const menu = document.getElementById("navbar");
    const burgerButton = document.getElementById("burger-menu");

    if (!menu || !burgerButton) {
        return;
    }

    menu.classList.remove("navbar-open");
    burgerButton.classList.remove("menu-open");
    burgerButton.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-is-open");
}

document.querySelectorAll("#navbar a").forEach((link) => {
    link.addEventListener("click", closeBurgerMenu);
});

const contactForm = document.getElementById("contact-form");

const validators = {
    name: (value) => value.trim() !== "",
    email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()),
    message: (value) => value.trim() !== "",
};

const messages = {
    name: "Your name is required",
    email: "Your email is required",
    message: "Your message is empty",
};

function setFieldState(field, isValid) {
    field.classList.toggle("is-valid", isValid);
    field.classList.toggle("is-error", !isValid);
}

function validateField(field) {
    const input = field.querySelector("input, textarea");
    const message = field.querySelector(".field-message");
    const validator = validators[input.name];
    const isValid = validator(input.value);

    if (input.name === "email" && input.value.trim() !== "" && !isValid) {
        message.textContent = "Please enter a valid email";
    } else {
        message.textContent = messages[input.name];
    }

    setFieldState(field, isValid);
    return isValid;
}

if (contactForm) {
    const fields = [...contactForm.querySelectorAll(".form-field")];
    const requiredInputs = [...contactForm.querySelectorAll('[name="name"], [name="email"], [name="message"]')];
    const privacyBox = contactForm.querySelector("#accept");
    const privacyWrapper = contactForm.querySelector(".check-privacy");
    const submitButton = contactForm.querySelector('button[type="submit"]');

    function isFieldValid(field) {
        const input = field.querySelector("input, textarea");
        return isInputValid(input);
    }

    function isInputValid(input) {
        const validator = validators[input.name];
        return Boolean(validator && validator(input.value));
    }

    function isFormReady() {
        return requiredInputs.length === Object.keys(validators).length &&
            requiredInputs.every(isInputValid) &&
            privacyBox.checked;
    }

    function updateSubmitButton() {
        const isReady = isFormReady();

        submitButton.classList.toggle("is-disabled", !isReady);
        submitButton.setAttribute("aria-disabled", String(!isReady));
        submitButton.disabled = !isReady;

        if (privacyBox.checked) {
            privacyWrapper.classList.remove("is-error");
        }
    }

    fields.forEach((field) => {
        const input = field.querySelector("input, textarea");

        input.addEventListener("blur", () => {
            validateField(field);
            updateSubmitButton();
        });
        input.addEventListener("input", () => {
            if (field.classList.contains("is-error") || field.classList.contains("is-valid")) {
                validateField(field);
            }
            updateSubmitButton();
        });
    });

    privacyBox.addEventListener("change", updateSubmitButton);
    updateSubmitButton();

    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const isFormValid = fields.every(validateField);
        const isPrivacyAccepted = privacyBox.checked;

        privacyWrapper.classList.toggle("is-error", !isPrivacyAccepted);

        if (isFormValid && isPrivacyAccepted) {
            contactForm.reset();
            fields.forEach((field) => field.classList.remove("is-valid", "is-error"));
            updateSubmitButton();
        }
    });
}
