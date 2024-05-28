// app.ts
var tasks = [];
var DATA_KEY = 'TodoItems';
var todoItems = [];
function renderTodoList() {
    var todoList = document.getElementById('todoList');
    if (todoList) {
        todoList.innerHTML = '';
        todoItems.forEach(function (todoItem) {
            var li = document.createElement('li');
            li.textContent = todoItem.name;
            todoList.appendChild(li);
        });
    }
}
function addTodo() {
    var todoInput = document.getElementById('todoInput');
    var newTask = todoInput.value.trim();
    if (newTask !== '') {
        var todoItem = { id: 1, name: newTask, isComplate: false };
        todoItems.push(todoItem);
        tasks.push(newTask);
        todoInput.value = '';
        saveTodoItems();
        renderTodoList();
    }
}
function saveTodoItems() {
    // todoItemsをローカルストレージに保存する
    var jsonData = JSON.stringify(todoItems);
    console.log("save data:" + jsonData);
    localStorage.setItem(DATA_KEY, jsonData);
}
function loadTodoItems() {
    // todoItemsをローカルストレージからロードする
    todoItems.splice(0, todoItems.length);
    var jsonData = localStorage.getItem(DATA_KEY);
    console.log("load data:" + jsonData);
    if (jsonData) {
        todoItems.push.apply(todoItems, JSON.parse(jsonData));
    }
}
// 初期化
loadTodoItems();
renderTodoList();
