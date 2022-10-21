export default class TaskModel {
  constructor(date, content, isCompleted) {
    this.id = date;
    this.content = content;
    this.completed = isCompleted;
  }
}