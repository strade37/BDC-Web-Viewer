export function setupProperties(viewer) {

    viewer.addEventListener(
        Autodesk.Viewing.SELECTION_CHANGED_EVENT,
        onSelectionChanged
    );

    function onSelectionChanged(event) {

        if (!event.dbIdArray.length) {
            return;
        }

        const dbId = event.dbIdArray[0];

        viewer.getProperties(dbId, (result) => {

            console.log(result);

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


    let html = "";

for (const category in groups) {

    html += `
        <div class="property-group">

            <div class="property-group-title">
                ${category}
            </div>
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
    `;

}


propertyList.innerHTML = html;
}