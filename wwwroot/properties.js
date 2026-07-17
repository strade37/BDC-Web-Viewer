export function setupProperties(viewer) {

    viewer.addEventListener(
        Autodesk.Viewing.SELECTION_CHANGED_EVENT,
        onSelectionChanged
    );

    function onSelectionChanged(event) {

        if (!event.dbIdArray.length) {
            clearProperties();
            return;
        }

        const dbId = event.dbIdArray[0];

        viewer.getProperties(dbId, (result) => {

            renderProperties(result);

        });

    }

}

function renderProperties(result) {

    const emptyState = document.querySelector(".empty-state");
    const propertyList = document.querySelector(".property-list");

    emptyState.classList.add("hidden");
    propertyList.classList.remove("hidden");

    // Group berdasarkan Category
    const groups = {};

    for (const property of result.properties) {

        const category = property.displayCategory || "Other";

        if (!groups[category]) {
            groups[category] = [];
        }

        groups[category].push(property);

    }

    console.log(groups);


    let html = `

    <div class="selected-object">

        <div class="selected-object-name">
            ${result.name}
        </div>

        <div class="selected-object-id">
            dbId : ${result.dbId}
        </div>

    </div>

`;

for (const category in groups) {

    html += `
        <div class="property-group">

            <div class="property-group-title">
                <span class="toggle-icon">▼</span>
                <span class="group-title">
                ${category}
                </span>
            </div>
            <div class="property-group-content">
    `;


    for (const property of groups[category]) {

        html += `
            <div class="property-item">

                <span class="property-name">
                    ${property.displayName}
                </span>

                <span class="property-value">
                    ${property.displayValue}
                </span>

            </div>
        `;

    }


    html += `
        </div>
        </div>
    `;

}


propertyList.innerHTML = html;
const titles = document.querySelectorAll(".property-group-title");

titles.forEach(title => {

    title.addEventListener("click", () => {

        const content = title.nextElementSibling;
        const icon = title.querySelector(".toggle-icon");

        if (content.style.display === "none") {

            content.style.display = "block";
            icon.textContent = "▼";

        } else {

            content.style.display = "none";
            icon.textContent = "▶";

        }

    });

});
}

function clearProperties() {

    const emptyState = document.querySelector(".empty-state");
    const propertyList = document.querySelector(".property-list");

    emptyState.classList.remove("hidden");
    propertyList.classList.add("hidden");

    propertyList.innerHTML = "";

}