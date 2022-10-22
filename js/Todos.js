import { saveToLS, getFromLS } from "./ls.js";

export default class Todos {
  toDoList = null;
  currentFilter = null;

  getTodos(key) {
    this.toDoList = getFromLS(key);
    if (!this.toDoList) this.toDoList = [];
    return this.toDoList;
  }
  showAllTodos(key) {
    this.toDoList = getFromLS(key);
    if (this.toDoList) {
      this.toDoList.forEach((task) => {
        task.isVisible = true;
      });
    }
    saveToLS(key, this.toDoList);
  }
  saveTodo(key, content) {
    let newTask = {
      id: new Date().valueOf(),
      content: content,
      isCompleted: false,
      isVisible: true,
    };
    this.toDoList.push(newTask);
    saveToLS(key, this.toDoList);
  }

  completeTodo(taskId, isCompleted, key) {
    this.toDoList.forEach((task) => {
      if (task.id == taskId) task.isCompleted = isCompleted;
    });
    this.filterTodos(this.currentFilter, key);
    saveToLS(key, this.toDoList);
  }

  removeTodo(taskId, key) {
    let newTodoList = this.toDoList.filter((task) => task.id !== taskId);
    this.toDoList = newTodoList;
    saveToLS(key, this.toDoList);
  }

  filterTodos(filterBy, key) {
    this.currentFilter = filterBy;
    this.showFilteredView(key);
  }

  showFilteredView(key) {
    if (this.currentFilter == "all" || !this.currentFilter) {
      this.toDoList.forEach((task) => {
        task.isVisible = true;
      });
    } else if (this.currentFilter == "active") {
      this.toDoList.forEach((task) => {
        task.isCompleted ? (task.isVisible = false) : (task.isVisible = true);
      });
    } else {
      this.toDoList.forEach((task) => {
        !task.isCompleted ? (task.isVisible = false) : (task.isVisible = true);
      });
    }
    saveToLS(key, this.toDoList);
  }
}
