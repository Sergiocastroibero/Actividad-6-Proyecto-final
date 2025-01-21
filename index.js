document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("crud-form");
    const tableBody = document.getElementById("crud-table-body");
    const tasksAddedCounter = document.getElementById("tasks-added");
    const tasksViewedCounter = document.getElementById("tasks-viewed");
    const modal = document.getElementById("modal");
    const modalTitle = document.getElementById("modal-title");
    const modalSpecs = document.getElementById("modal-specs");
    const modalInfo = document.getElementById("modal-info");
    const markAsViewedButton = document.getElementById("mark-as-viewed");
    const closeModal = document.getElementById("close-modal");

    let cylinders = [];
    let tasksViewed = 0;
    let currentViewedTask = null;

    // Cargar
    function loadFromLocalStorage() {
        const storedCylinders = localStorage.getItem("cylinders");
        const storedTasksViewed = localStorage.getItem("tasksViewed");

        if (storedCylinders) {
            cylinders = JSON.parse(storedCylinders);
        }

        if (storedTasksViewed) {
            tasksViewed = parseInt(storedTasksViewed, 10);
        }

        renderTable();
        updateCounters();
    }

    // Guardar datos 
    function saveToLocalStorage() {
        localStorage.setItem("cylinders", JSON.stringify(cylinders));
        localStorage.setItem("tasksViewed", tasksViewed);
    }

    // la tabla
    function renderTable() {
        tableBody.innerHTML = cylinders
            .map(
                (cylinder) => `
                <tr>
                    <td>${cylinder.name} ${cylinder.viewed ? '✅' : ''}</td>
                    <td>${cylinder.type}</td>
                    <td>
                        <button class="mybutton" onclick="viewDetails(${cylinder.id})">Ver</button>
                        <button class="mybutton" onclick="editCylinder(${cylinder.id})">Editar</button>
                        <button class="mybutton" onclick="deleteCylinder(${cylinder.id})">Eliminar</button>
                    </td>
                </tr>
            `
            )
            .join("");
    }

    // Actualizar contadores casi no puedo jaja
    function updateCounters() {
        tasksAddedCounter.textContent = cylinders.length;
        tasksViewedCounter.textContent = tasksViewed;
        if (!cylinders.length) {
            tasksViewed = 0;
        }
    }

    // Ver detalles
    window.viewDetails = (id) => {
        const cylinder = cylinders.find((c) => c.id === id);
        if (cylinder) {
            currentViewedTask = cylinder;
            modalTitle.textContent = `Detalles de ${cylinder.name}`;
            modalSpecs.textContent = `Especificaciones: ${cylinder.specs}`;
            modalInfo.textContent = `Información adicional: ${cylinder.info || "No disponible"}`;
            modal.style.display = "block";

            markAsViewedButton.disabled = cylinder.viewed;
            markAsViewedButton.textContent = cylinder.viewed
                ? "Visto"
                : "Marcar como Visto";
        }
    };

    // Marcar visto
    markAsViewedButton.addEventListener("click", () => {
        if (currentViewedTask && !currentViewedTask.viewed) {
            currentViewedTask.viewed = true;
            tasksViewed++;
            updateCounters();
            saveToLocalStorage();
            markAsViewedButton.disabled = true;
            markAsViewedButton.textContent = "Visto";
            renderTable();
        }
    });

    // Editar tarea
    window.editCylinder = (id) => {
        const cylinder = cylinders.find((c) => c.id === id);
    
        if (cylinder) {
            if (cylinder.viewed) {
                tasksViewed--;
            }
            document.getElementById("cylinder-name").value = cylinder.name;
            document.getElementById("cylinder-type").value = cylinder.type;
            document.getElementById("cylinder-specs").value = cylinder.specs;
            document.getElementById("cylinder-info").value = cylinder.info;
    
            cylinders = cylinders.filter((c) => c.id !== id);
    
            renderTable();
            updateCounters(); 
            saveToLocalStorage(); 
        }
    };
    

    // Eliminar tarea
    window.deleteCylinder = (id) => {
        const cylinder = cylinders.find((c) => c.id === id);
        
        if (cylinder && cylinder.viewed) {
            tasksViewed--;
        }

        cylinders = cylinders.filter((c) => c.id !== id); 
        renderTable();
        updateCounters(); 
        saveToLocalStorage(); 
    };

    // Cerrar modal
    closeModal.addEventListener("click", () => {
        modal.style.display = "none";
    });

    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("cylinder-name").value.trim();
        const type = document.getElementById("cylinder-type").value.trim();
        const specs = document.getElementById("cylinder-specs").value.trim();
        const info = document.getElementById("cylinder-info").value.trim();

        if (name && type && specs) {
            const newCylinder = {
                id: Date.now(),
                name,
                type,
                specs,
                info,
                viewed: false
            };

            cylinders.push(newCylinder);
            renderTable();
            updateCounters();
            saveToLocalStorage();
            form.reset();
        } else {
            alert("Por favor, completa todos los campos obligatorios.");
        }
    });

    loadFromLocalStorage();
});


   








