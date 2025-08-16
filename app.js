const API_URL = "http://localhost:5000/api/todos";
const form = document.querySelector(".input-area");
const todoInput = document.getElementById("todo-input");
const statusSelect = document.getElementById("status-select");
const taskList = document.querySelector(".task-list");

// Load tasks on page load
window.addEventListener("DOMContentLoaded", loadTasks);

// Load tasks from backend and filter
async function loadTasks() {
    try {
        const response = await fetch(API_URL);
        const todos = await response.json();

        // Clear existing list
        taskList.innerHTML = "";

        // Filter tasks based on dropdown
        const selectedStatus = statusSelect.value;
        const filteredTodos = todos.filter(todo =>
            selectedStatus === "all" ? true : todo.status === selectedStatus
        );

        filteredTodos.forEach(todo => addTaskToUI(todo));
    } catch (err) {
        console.error("Error loading todos:", err);
    }
}

// Add new task
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const newTodo = {
        title: todoInput.value,
        description: "",
        status: "pending" // new task always starts as pending
    };

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newTodo)
        });

        const savedTodo = await response.json();
        loadTasks(); // reload based on current filter

        todoInput.value = "";
    } catch (err) {
        console.error("Error adding todo:", err);
    }
});

// Re-filter tasks when dropdown changes
statusSelect.addEventListener("change", loadTasks);

// Function to add task to UI
function addTaskToUI(todo) {
    const li = document.createElement("li");
    li.classList.add("task-item");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.status === "completed";

    const span = document.createElement("span");
    span.textContent = todo.title;
    span.classList.add("task-title");

    if (todo.status === "completed") {
        span.style.textDecoration = "line-through";
    }

    // Update button
    const updateBtn = document.createElement("button");
    updateBtn.classList.add("update-btn");
    updateBtn.innerHTML = `<i class="fa-solid fa-pen"></i>`;

    updateBtn.addEventListener("click", async () => {
        const newTitle = prompt("Update task:", todo.title);
        if (newTitle) {
            try {
                await fetch(`${API_URL}/${todo.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ ...todo, title: newTitle })
                });
                loadTasks();
            } catch (err) {
                console.error("Error updating todo:", err);
            }
        }
    });

    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.innerHTML = `<i class="fa-solid fa-trash"></i>`;

    deleteBtn.addEventListener("click", async () => {
        try {
            await fetch(`${API_URL}/${todo.id}`, { method: "DELETE" });
            loadTasks();
        } catch (err) {
            console.error("Error deleting todo:", err);
        }
    });

    // Checkbox toggle
    checkbox.addEventListener("change", async () => {
        const updatedStatus = checkbox.checked ? "completed" : "pending";
        try {
            await fetch(`${API_URL}/${todo.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...todo, status: updatedStatus })
            });
            loadTasks(); // refresh based on filter
        } catch (err) {
            console.error("Error updating todo:", err);
        }
    });

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(updateBtn);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
}
