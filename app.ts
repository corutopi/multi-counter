// app.ts
let tasks: string[] = [];
const DATA_KEY = 'TodoData'
const VERSION_NUM = '0.0.1'
var todoData: TodoData = {
  versionNum: VERSION_NUM,
  todoItems: []
};

function renderTodoList() {
  // todoリストを(再)表示する
  const todoList = document.getElementById('todoList');
  if (todoList) {
    todoList.innerHTML = '';
    todoData.todoItems.forEach(todoItem => {
      const li = document.createElement('li');
      li.textContent = todoItem.name;
      todoList.appendChild(li);
    });
  }
}

function addTodo() {
  // todoリストを追加する
  const todoInput = document.getElementById('todoInput') as HTMLInputElement;
  const newTask = todoInput.value.trim();
  if (newTask !== '') {
    const todoItem: TodoItem = {id: 1, name: newTask, isComplate: false}
    todoData.todoItems.push(todoItem)
    tasks.push(newTask);
    todoInput.value = '';
    saveTodoItems();
    renderTodoList();
  }
}

interface TodoData {
  versionNum: string
  todoItems: TodoItem[];
}

interface TodoItem {
  id: number;
  name: string;
  isComplate: boolean;
}

function saveTodoItems() {
  // todoItemsをローカルストレージに保存する
  const jsonData = JSON.stringify(todoData);
  console.log("save data:" + jsonData);
  localStorage.setItem(DATA_KEY, jsonData);
}

function loadTodoItems() {
  // todoItemsをローカルストレージからロードする
  const jsonData = localStorage.getItem(DATA_KEY)
  console.log("load data:" + jsonData)
  if (jsonData) {
    todoData = JSON.parse(jsonData)
  }
}

// 初期化
loadTodoItems();
renderTodoList();


