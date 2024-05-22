"use strict";
// app.ts
var tasks = [];
var todoItems = [];
function renderTodoList() {
    var todoList = document.getElementById('todoList');
    if (todoList) {
        todoList.innerHTML = '';
        // tasks.forEach(task => {
        //   const li = document.createElement('li');
        //   li.textContent = task;
        //   todoList.appendChild(li);
        // });
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
        renderTodoList();
    }
}
// 初期化
renderTodoList();
