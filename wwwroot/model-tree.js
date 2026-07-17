export function setupModelTree(viewer) {

    viewer.addEventListener(
        Autodesk.Viewing.GEOMETRY_LOADED_EVENT,
        onModelLoaded
    );

    function onModelLoaded() {

        const tree = viewer.model.getInstanceTree();

        if (!tree) return;

        const rootId = tree.getRootId();
        const treeContainer = document.getElementById("model-tree");

        treeContainer.innerHTML = buildTree(tree, rootId);

        enableTreeInteraction();

    }

    function buildTree(tree, nodeId) {

        const nodeName = tree.getNodeName(nodeId);
        const childCount = tree.getChildCount(nodeId);

        let html = "";

        if (childCount > 0) {

            html += `
                <div class="tree-folder">

                    <div class="tree-node folder" data-id="${nodeId}">

                        <span class="toggle">▼</span>

                        <span class="icon">📁</span>

                        <span class="label">${nodeName}</span>

                    </div>

                    <div class="tree-children">
            `;

            tree.enumNodeChildren(nodeId, (childId) => {

                html += buildTree(tree, childId);

            });

            html += `
                    </div>

                </div>
            `;

        } else {

            html += `
                <div class="tree-node file" data-id="${nodeId}">

                    <span class="icon">📄</span>

                    <span class="label">${nodeName}</span>

                </div>
            `;

        }

        return html;

    }

    function enableTreeInteraction() {

        // Expand / Collapse hanya saat klik panah
        document.querySelectorAll(".toggle").forEach(toggle => {

            toggle.addEventListener("click", function (e) {

                e.stopPropagation();

                const folder = toggle.closest(".tree-node");
                const children = folder.nextElementSibling;

                if (!children) return;

                if (children.style.display === "none") {

                    children.style.display = "block";
                    toggle.textContent = "▼";

                } else {

                    children.style.display = "none";
                    toggle.textContent = "▶";

                }

            });

        });

        // Klik node langsung pilih object
        document.querySelectorAll(".tree-node").forEach(node => {

            node.addEventListener("click", function (e) {

                e.stopPropagation();

                const dbId = Number(node.dataset.id);

                viewer.select(dbId);
                viewer.fitToView([dbId]);

            });

        });

        // Viewer -> Tree Highlight
        viewer.addEventListener(
            Autodesk.Viewing.SELECTION_CHANGED_EVENT,
            (event) => {

                if (!event.dbIdArray.length) return;

                highlightTreeNode(event.dbIdArray[0]);

            }
        );

    }

    function highlightTreeNode(dbId) {

        // Hapus highlight lama
        document.querySelectorAll(".tree-node.active").forEach(node => {
            node.classList.remove("active");
        });

        // Cari node sesuai dbId
        const node = document.querySelector(
            `.tree-node[data-id="${dbId}"]`
        );

        if (!node) return;

        // Tambahkan highlight
        node.classList.add("active");

        // Scroll otomatis
        node.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });

    }

}