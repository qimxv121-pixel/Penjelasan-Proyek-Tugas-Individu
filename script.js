const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#primary-navigation");
const shareButton = document.querySelector("[data-share]");
const toast = document.querySelector(".toast");
const lightbox = document.querySelector(".lightbox");
let toastTimer;

if (menuButton && navigation) {
    menuButton.addEventListener("click", () => {
        const isOpen = menuButton.getAttribute("aria-expanded") === "true";
        menuButton.setAttribute("aria-expanded", String(!isOpen));
        navigation.classList.toggle("is-open", !isOpen);
    });

    navigation.addEventListener("click", (event) => {
        if (event.target instanceof Element && event.target.closest("a")) {
            menuButton.setAttribute("aria-expanded", "false");
            navigation.classList.remove("is-open");
        }
    });
}

document.querySelectorAll("[data-current-year]").forEach((element) => {
    element.textContent = String(new Date().getFullYear());
});

function showToast(message) {
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("visible"), 3200);
}

if (shareButton) {
    shareButton.addEventListener("click", async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: document.title,
                    url: window.location.href
                });
                return;
            }

            if (!navigator.clipboard) {
                showToast("Fitur salin tautan tidak tersedia di browser ini.");
                return;
            }

            await navigator.clipboard.writeText(window.location.href);
            showToast("Tautan halaman berhasil disalin.");
        } catch (error) {
            if (error instanceof DOMException && error.name === "AbortError") return;
            showToast("Tautan tidak dapat dibagikan. Coba salin alamat halaman dari browser.");
        }
    });
}

if (lightbox instanceof HTMLDialogElement) {
    const preview = lightbox.querySelector("img");
    const caption = lightbox.querySelector("p");
    const closeButton = lightbox.querySelector(".lightbox-close");

    document.querySelectorAll("[data-lightbox]").forEach((link) => {
        link.addEventListener("click", (event) => {
            if (!(link instanceof HTMLAnchorElement) || !preview || !caption) return;
            event.preventDefault();
            preview.src = link.href;
            preview.alt = link.querySelector("img")?.alt ?? "";
            caption.textContent = preview.alt;
            lightbox.showModal();
        });
    });

    closeButton?.addEventListener("click", () => lightbox.close());
    lightbox.addEventListener("click", (event) => {
        if (event.target === lightbox) lightbox.close();
    });
}
