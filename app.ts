// app.ts
let tasks: string[] = [];
const DATA_KEY = 'TodoData'
const VERSION_NUM = '0.0.1'
var todoData: TodoData = {
  versionNum: VERSION_NUM,
  todoItems: []
};
var idNum: number = 0


function renderTodoList() {
  // todoリストを(再)表示する
  const todoList = document.getElementById('todoList');
  if (todoList) {
    todoList.innerHTML = '';
    todoData.todoItems.forEach(todoItem => {
      const li = document.createElement('li');

      const span = document.createElement('span');
      span.textContent = todoItem.name;

      const span1 = document.createElement('span');
      span1.textContent = todoItem.counter.toString();

      const countUpButton = document.createElement('button');
      countUpButton.textContent = '+';
      countUpButton.className = 'add-button'
      countUpButton.onclick = () => countUp(todoItem.name);

      const countDownButton = document.createElement('button');
      countDownButton.textContent = '-';
      countDownButton.className = 'sub-button'
      countDownButton.onclick = () => countDown(todoItem.name);

      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.className = 'delete-button'
      deleteButton.onclick = () => deleteTodo(todoItem.name);

      li.appendChild(span);
      li.appendChild(span1);
      li.appendChild(countUpButton);
      li.appendChild(countDownButton);
      li.appendChild(deleteButton);
      todoList.appendChild(li);
      idNum = Math.max(idNum, todoItem.id);
    });
  }
}

function countUp(key: string){
  todoData.todoItems
    .filter(item => item.name === key)
    .forEach(item => { item.counter += 1 });
  saveTodoItems();
  renderTodoList();
}

function countDown(key: string){
  todoData.todoItems
    .filter(item => item.name === key)
    .forEach(item => { item.counter -= 1 });
  saveTodoItems();
  renderTodoList();
}

function deleteTodo(key: string) {
  todoData.todoItems = todoData.todoItems.filter(item => item.name !== key);
  saveTodoItems();
  renderTodoList();
}

function addTodo() {
  // todoリストを追加する
  const todoInput = document.getElementById('todoInput') as HTMLInputElement;
  const newTask = todoInput.value.trim();
  if (newTask !== '') {
    const todoItem: TodoItem = {id: ++idNum, name: newTask, counter: 0}
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
  counter: number;
  // isComplate: boolean;
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


