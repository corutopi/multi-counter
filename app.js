// app.ts
var tasks = [];
var DATA_KEY = 'TodoData';
var VERSION_NUM = '0.0.1';
var todoData = {
    versionNum: VERSION_NUM,
    todoItems: []
};
var idNum = 0;
function renderTodoList() {
    // todoリストを(再)表示する
    var todoList = document.getElementById('todoList');
    if (todoList) {
        todoList.innerHTML = '';
        todoData.todoItems.forEach(function (todoItem) {
            var li = document.createElement('li');
            var span = document.createElement('span');
            span.textContent = todoItem.name;
            var span1 = document.createElement('span');
            span1.textContent = todoItem.counter.toString();
            var countUpButton = document.createElement('button');
            countUpButton.textContent = '+';
            countUpButton.className = 'add-button';
            countUpButton.onclick = function () { return countUp(todoItem.name); };
            var deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.className = 'delete-button';
            deleteButton.onclick = function () { return deleteTodo(todoItem.name); };
            li.appendChild(span);
            li.appendChild(span1);
            li.appendChild(countUpButton);
            li.appendChild(deleteButton);
            todoList.appendChild(li);
            idNum = Math.max(idNum, todoItem.id);
        });
    }
}
function countUp(key) {
    todoData.todoItems
        .filter(function (item) { return item.name === key; })
        .forEach(function (item) { item.counter += 1; });
    saveTodoItems();
    renderTodoList();
}
function deleteTodo(key) {
    todoData.todoItems = todoData.todoItems.filter(function (item) { return item.name !== key; });
    saveTodoItems();
    renderTodoList();
}
function addTodo() {
    // todoリストを追加する
    var todoInput = document.getElementById('todoInput');
    var newTask = todoInput.value.trim();
    if (newTask !== '') {
        var todoItem = { id: ++idNum, name: newTask, counter: 0 };
        todoData.todoItems.push(todoItem);
        tasks.push(newTask);
        todoInput.value = '';
        saveTodoItems();
        renderTodoList();
    }
}
function saveTodoItems() {
    // todoItemsをローカルストレージに保存する
    var jsonData = JSON.stringify(todoData);
    console.log("save data:" + jsonData);
    localStorage.setItem(DATA_KEY, jsonData);
}
function loadTodoItems() {
    // todoItemsをローカルストレージからロードする
    var jsonData = localStorage.getItem(DATA_KEY);
    console.log("load data:" + jsonData);
    if (jsonData) {
        todoData = JSON.parse(jsonData);
    }
}
// 初期化
loadTodoItems();
renderTodoList();
