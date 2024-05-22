// app.ts
let tasks: string[] = [];
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
}

function loadTodoItems() {
  // todoItemsをローカルストレージからロードする
}



// 初期化
renderTodoList();


