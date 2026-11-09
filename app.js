
let tasks = load();
let currentFilter = "all";

const form = document.getElementById("form");
const input = document.getElementById("text");
const list = document.getElementById("list");
const count = document.getElementById("count");
const clearButton = document.getElementById("clear");

function load() {
    try {
        return JSON.parse(localStorage.getItem("tasks")) || [];
    } catch (error) {
        return [];
    }
}

function save() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function render() {
    list.innerHTML = "";

    const filteredTasks = tasks.filter(function(task) {
        if (currentFilter === "active") {
            return !task.done;
        }

        if (currentFilter === "done") {
            return task.done;
        }

        return true;
    });

    filteredTasks.forEach(function(task) {
        const li = document.createElement("li");

        li.dataset.id = task.id;
        li.className = task.done ? "done" : "";

        const span = document.createElement("span");
        span.textContent = task.text;

        const toggle = document.createElement("button");
        toggle.textContent = task.done ? "Undo" : "Done";
        toggle.dataset.action = "toggle";

        const del = document.createElement("button");
        del.textContent = "Delete";
        del.dataset.action = "delete";

        li.append(span, toggle, del);
        list.append(li);
    });

    const remaining = tasks.filter(function(task) {
        return !task.done;
    }).length;

    count.textContent = remaining + " left";
}

form.addEventListener("submit", function(e) {
    e.preventDefault();

    const text = input.value.trim();

    if (text === "") {
        alert("Please enter a task!");
        return;
    }

    tasks.push({
        id: Date.now(),
        text: text,
        done: false
    });

    input.value = "";

    save();
    render();
});

list.addEventListener("click", function(e) {
    const action = e.target.dataset.action;

    if (!action) return;

    const li = e.target.closest("li");
    const id = Number(li.dataset.id);

    if (action === "delete") {
        tasks = tasks.filter(function(task) {
            return task.id !== id;
        });
    }

    if (action === "toggle") {
        tasks.forEach(function(task) {
            if (task.id === id) {
                task.done = !task.done;
            }
        });
    }

    save();
    render();
});

document.querySelectorAll(".filter").forEach(function(button) {
    button.addEventListener("click", function() {
        currentFilter = button.dataset.filter;

        document.querySelectorAll(".filter").forEach(function(btn) {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        render();
    });
});

clearButton.addEventListener("click", function() {
    tasks = tasks.filter(function(task) {
        return !task.done;
    });

    save();
    render();
});

render();
