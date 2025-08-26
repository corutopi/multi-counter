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
    // --- 自動加算処理 ---
    var now = Date.now();
    todoData.todoItems.forEach(function (todoItem) {
        var _a;
        var detail = todoItem.detail;
        var auto = detail === null || detail === void 0 ? void 0 : detail.autoCountupByTime;
        if ((auto === null || auto === void 0 ? void 0 : auto.isActive) && auto.interval && auto.addnum && auto.baseDatetime) {
            // lastCheckDatetimeがなければbaseDatetimeを使う
            var lastChecked = (_a = auto.lastCheckDatetime) !== null && _a !== void 0 ? _a : auto.baseDatetime;
            // 現在時刻までに何回加算すべきか計算
            var elapsed = now - lastChecked;
            var times = Math.floor(elapsed / auto.interval);
            if (times > 0) {
                todoItem.counter += times * auto.addnum;
                // lastCheckDatetimeを更新
                if (todoItem.detail && todoItem.detail.autoCountupByTime) {
                    todoItem.detail.autoCountupByTime.lastCheckDatetime = lastChecked + times * auto.interval;
                }
            }
        }
    });
    saveTodoItems();
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
            var countDownButton = document.createElement('button');
            countDownButton.textContent = '-';
            countDownButton.className = 'sub-button';
            countDownButton.onclick = function () { return countDown(todoItem.name); };
            // Detailボタン追加
            var detailButton = document.createElement('button');
            detailButton.textContent = 'Detail';
            detailButton.className = 'detail-button';
            detailButton.onclick = function () { return openDetailModal(todoItem.name); };
            var deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.className = 'delete-button';
            deleteButton.onclick = function () { return deleteTodo(todoItem.name); };
            li.appendChild(span);
            li.appendChild(span1);
            li.appendChild(countUpButton);
            li.appendChild(countDownButton);
            li.appendChild(detailButton);
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
function countDown(key) {
    todoData.todoItems
        .filter(function (item) { return item.name === key; })
        .forEach(function (item) { item.counter -= 1; });
    saveTodoItems();
    renderTodoList();
}
// モーダル制御用変数
var currentDetailKey = null;
// モーダルを開く
function openDetailModal(key) {
    var _a, _b, _c, _d, _e;
    currentDetailKey = key; // モーダルタイトルをTodo名に変更
    var modalTitle = document.getElementById('detailModalTitle');
    if (modalTitle) {
        modalTitle.textContent = "\u8A73\u7D30\u8A2D\u5B9A\uFF08".concat(key, "\uFF09");
    }
    // 現在値を取得
    var todoItem = todoData.todoItems.filter(function (item) { return item.name === key; })[0];
    var auto = (_a = todoItem === null || todoItem === void 0 ? void 0 : todoItem.detail) === null || _a === void 0 ? void 0 : _a.autoCountupByTime;
    // チェックボックス・インターバル・加算値を反映
    var autoCountupCheckbox = document.getElementById('autoCountupCheckbox');
    var intervalInput = document.getElementById('intervalInput');
    var addValueInput = document.getElementById('addValueInput');
    if (autoCountupCheckbox)
        autoCountupCheckbox.checked = !!(auto === null || auto === void 0 ? void 0 : auto.isActive);
    if (intervalInput)
        intervalInput.value = (_c = (_b = auto === null || auto === void 0 ? void 0 : auto.interval) === null || _b === void 0 ? void 0 : _b.toString()) !== null && _c !== void 0 ? _c : '1000';
    if (addValueInput)
        addValueInput.value = (_e = (_d = auto === null || auto === void 0 ? void 0 : auto.addnum) === null || _d === void 0 ? void 0 : _d.toString()) !== null && _e !== void 0 ? _e : '1';
    document.getElementById('detailModal').style.display = 'flex';
}
// モーダルを閉じる
function closeDetailModal() {
    document.getElementById('detailModal').style.display = 'none';
    currentDetailKey = null;
}
// モーダルのイベント設定
window.onload = function () {
    loadTodoItems();
    renderTodoList();
    var okBtn = document.getElementById('detailOkButton');
    var cancelBtn = document.getElementById('detailCancelButton');
    okBtn === null || okBtn === void 0 ? void 0 : okBtn.addEventListener('click', function () {
        if (!currentDetailKey)
            return;
        var autoCountup = document.getElementById('autoCountupCheckbox').checked;
        var interval = parseInt(document.getElementById('intervalInput').value, 10);
        var addValue = parseInt(document.getElementById('addValueInput').value, 10);
        // detail情報を保存
        todoData.todoItems
            .filter(function (item) { return item.name === currentDetailKey; })
            .forEach(function (item) {
            var _a, _b;
            if (!item.detail)
                item.detail = {};
            var prevBase = (_a = item.detail.autoCountupByTime) === null || _a === void 0 ? void 0 : _a.baseDatetime;
            var prevLast = (_b = item.detail.autoCountupByTime) === null || _b === void 0 ? void 0 : _b.lastCheckDatetime;
            var now = Date.now();
            item.detail.autoCountupByTime = {
                isActive: autoCountup,
                interval: interval,
                addnum: addValue,
                baseDatetime: prevBase !== null && prevBase !== void 0 ? prevBase : now,
                lastCheckDatetime: prevLast !== null && prevLast !== void 0 ? prevLast : now,
            };
        });
        closeDetailModal();
        saveTodoItems();
        renderTodoList();
    });
    cancelBtn === null || cancelBtn === void 0 ? void 0 : cancelBtn.addEventListener('click', closeDetailModal);
};
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
