// app.ts
let tasks: string[] = [];
const DATA_KEY = 'TodoItems'
const todoItems: TodoItem[] = [];

function renderTodoList() {
  const todoList = document.getElementById('todoList');
  if (todoList) {
    todoList.innerHTML = '';
    todoItems.forEach(todoItem => {
      const li = document.createElement('li');
      li.textContent = todoItem.name;
      todoList.appendChild(li);
    });
  }
}

function addTodo() {
  const todoInput = document.getElementById('todoInput') as HTMLInputElement;
  const newTask = todoInput.value.trim();
  if (newTask !== '') {
    const todoItem: TodoItem = {id: 1, name: newTask, isComplate: false}
    todoItems.push(todoItem)
    tasks.push(newTask);
    todoInput.value = '';
    saveTodoItems();
    renderTodoList();
  }
}

interface TodoItem {
  id: number;
  name: string;
  isComplate: boolean;
}

function saveTodoItems() {
  // todoItemsをローカルストレージに保存する
  const jsonData = JSON.stringify(todoItems);
  console.log("save data:" + jsonData);
  localStorage.setItem(DATA_KEY, jsonData);
}

function loadTodoItems() {
  // todoItemsをローカルストレージからロードする
  todoItems.splice(0, todoItems.length);
  const jsonData = localStorage.getItem(DATA_KEY)
  console.log("load data:" + jsonData)
  if (jsonData) {
    todoItems.push(...JSON.parse(jsonData))
  }
}

// 初期化
loadTodoItems();
renderTodoList();


