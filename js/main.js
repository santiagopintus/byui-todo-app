import getEl, { create } from "./utilities.js";
import Todos from "./Todos.js";
let lsKey = "todos";
let tasksCount = { all: 0, active: 0, completed: 0 };

const main = () => {
  const todos = new Todos();
  /* LOAD TASKS */
  todos.showAllTodos(lsKey);
  updateTasks(todos);
  /* LISTEN FOR SUBMIT FORM */
  listenSubmit(todos);
  /* LISTEN FILTERS */
  listenFilters(todos);
};

/***   ADD TASK   ***/
const listenSubmit = (todos) => {
  const $form = getEl("tasksForm", "id");
  $form.addEventListener("submit", (e) => handleSubmit(e, todos));
};
// Handle form submition
const handleSubmit = (e, todos) => {
  e.preventDefault();
  todos.saveTodo(lsKey, e.target.taskName.value);
  updateTasks(todos);
  e.target.taskName.value = "";
};

/* UPDATE TASK LIST */
const updateTasks = (todos) => {
  let tasks = todos.getTodos(lsKey);
  updateTasksCount(tasks);
  const $list = getEl("tasksList", "id");
  if (!tasks.length) {
    $list.innerHTML = "<p>There are no tasks to show</p>";
    return;
  }
  /* Remove old tasks from html */
  $list.innerHTML = "";
  renderTodoList(tasks, $list);
  /* Listen for task complete */
  listenCompletion(tasks, todos);
  listenDelete(tasks, todos);
  todos.showFilteredView(lsKey);
};

const updateTasksCount = (tasks) => {
  let all = tasks.lenght;
  let active = 0;
  let completed = 0;
  tasks.forEach((task) => {
    if (!task.isCompleted) active++;
    else completed++;
  });
  tasksCount.all = all;
  tasksCount.active = active;
  tasksCount.completed = completed;

  getEl("remainingTasksNum", "id").innerHTML = tasksCount.active;
};

const renderTodoList = (tasks, $list) => {
  tasks.forEach((task) => {
    if (task.isVisible) {
      $list.appendChild(createHtmlTask(task));
    }
  });
};

const createHtmlTask = (task) => {
  let $task = create("li");
  $task.setAttribute("id", `task-${task.id}`);
  $task.classList.add("task-item");
  /* task content */
  $task.innerHTML = `
    <input id="input-${task.id}" type="checkbox" ${
    task.isCompleted ? "checked" : ""
  }>
    <label for="input-${task.id}">${task.content}</label>
    <button id="removeBtn-${task.id}" class="delete-task-icon">X</button>
    `;
  if (task.isCompleted) {
    $task.classList.add("completed");
  }
  return $task;
};

const listenCompletion = (tasks, todos) => {
  tasks.forEach((task) => {
    let input = document.getElementById(`input-${task.id}`);
    if (input) {
      input.addEventListener("change", (e) => {
        todos.completeTodo(task.id, e.target.checked, lsKey);
        updateTasks(todos);
      });
    }
  });
};

const listenDelete = (tasks, todos) => {
  tasks.forEach((task) => {
    let removeBtn = document.getElementById(`removeBtn-${task.id}`);
    if (removeBtn) {
      removeBtn.addEventListener("click", (_) => {
        todos.removeTodo(task.id, lsKey);
        updateTasks(todos);
      });
    }
  });
};

/* FILTER TASKS */
const listenFilters = (todos) => {
  let filterAll = getEl("filterAll", "id");
  let filterActive = getEl("filterActive", "id");
  let filterCompleted = getEl("filterCompleted", "id");
  const $filters = getEl(".filter", "classes");

  $filters.forEach((filter) => {
    filter.addEventListener("change", (e) => {
      todos.filterTodos(e.target.id, lsKey);
      updateFilterStyles(e.target.id, filterAll, filterActive, filterCompleted);
      updateTasks(todos);
    });
  });
  updateFilterStyles("all", filterAll, filterActive, filterCompleted);
};

const updateFilterStyles = (
  filterBy,
  filterAll,
  filterActive,
  filterCompleted
) => {
  filterAll.classList.remove("active");
  filterActive.classList.remove("active");
  filterCompleted.classList.remove("active");
  let currentFilter;
  filterBy === "all"
    ? (currentFilter = filterAll)
    : filterBy === "active"
    ? (currentFilter = filterActive)
    : filterBy === "completed"
    ? (currentFilter = filterCompleted)
    : "";
  currentFilter.classList.add("active");
};

document.addEventListener("DOMContentLoaded", main);
