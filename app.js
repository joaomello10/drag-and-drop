const draggables = document.querySelectorAll(".draggable");
const containers = document.querySelectorAll(".container");
const form = document.querySelector("form");
const input = document.querySelector("#input");
const getTodos = JSON.parse(localStorage.getItem("todos"));

let todos = getTodos !== null ? getTodos : [];

addTodos();

form.addEventListener("submit", (e) => {
  e.preventDefault();
  createTodo();
  input.value = "";
});

function createTodo() {
  if (input.value.trim() == "") {
    return;
  }

  const todo = {
    value: input.value,
    id: generateId(),
    container: "container-todo",
  };

  todos.push(todo);
  setLocalStorage();
  addTodos();
}

function addTodos() {
  containers.forEach((container) => {
    container.innerHTML = `<h1>${container.firstElementChild.textContent}</h1>`;
  });
  todos.forEach((todo) => {
    const div = document.createElement("div");
    div.classList.add("draggable");
    div.draggable = true;
    div.innerHTML = todo.value;
    div.id = todo.id;

    div.addEventListener("dragstart", () => {
      div.classList.add("dragging");
      containers.forEach((container) => {
        container.classList.add("over");
        if (container.id == todo.container) {
          container.classList.remove("over");
        }
      });
    });

    div.addEventListener("dragend", () => {
      div.classList.remove("dragging");
      containers.forEach((container) => {
        container.classList.remove("over");
      });
    });

    div.appendChild(createBt(div, todo.id));
    document.querySelector(`#${todo.container}`).append(div);
  });
}

function generateId() {
  return Math.round(Math.random() * 1000);
}

function createBt(div, ID) {
  const bt = document.createElement("button");
  bt.classList.add("bt");
  bt.innerHTML = '<i class="fas fa-trash"></i>';
  bt.addEventListener("click", () => {
    todos = todos.filter((todo) => todo.id !== ID);

    div.classList.add("remove");

    setTimeout(() => {
      addTodos();
      setLocalStorage();
    }, 700);
  });

  return bt;
}

function setLocalStorage() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

containers.forEach((container) => {
  container.addEventListener("dragover", (e) => {
    e.preventDefault();
    const dragable = document.querySelector(".dragging");
    todos.forEach((todo) => {
      if (todo.id == dragable.id) {
        todo.container = container.id;
        setLocalStorage();
      }
    });
    const afterElement = dragAfter(container, e.clientY);
    if (afterElement == null) {
      container.appendChild(dragable);
    } else {
      container.insertBefore(dragable, afterElement);
    }
  });
});

function dragAfter(container, y) {
  const draggableElements = [
    ...container.querySelectorAll(".draggable:not(.dragging)"),
  ];

  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    {
      offset: Number.NEGATIVE_INFINITY,
    }
  ).element;
}
