export function setupNavigation() {

    const menus = document.querySelectorAll(".menu-item[data-page]");

    menus.forEach(menu => {

        menu.addEventListener("click", () => {

            // Active Menu
            document.querySelectorAll(".menu-item")
                .forEach(item => item.classList.remove("active"));

            menu.classList.add("active");

            // Hide semua page
            document.querySelectorAll(".page")
                .forEach(page => page.style.display = "none");

            // Show page
            const page = menu.dataset.page;

            document.getElementById(`page-${page}`).style.display = "block";

        });

    });

}