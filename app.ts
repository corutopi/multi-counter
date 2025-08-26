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

  // --- 自動加算処理 ---
  const now = Date.now();
  todoData.todoItems.forEach(todoItem => {
    const detail = todoItem.detail;
    const auto = detail?.autoCountupByTime;
    if (auto?.isActive && auto.interval && auto.addnum && auto.baseDatetime) {
      // lastCheckDatetimeがなければbaseDatetimeを使う
      const lastChecked = auto.lastCheckDatetime ?? auto.baseDatetime;
      // 現在時刻までに何回加算すべきか計算
      const elapsed = now - lastChecked;
      const times = Math.floor(elapsed / auto.interval);
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

      // Detailボタン追加
      const detailButton = document.createElement('button');
      detailButton.textContent = 'Detail';
      detailButton.className = 'detail-button';
      detailButton.onclick = () => openDetailModal(todoItem.name);

      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.className = 'delete-button'
      deleteButton.onclick = () => deleteTodo(todoItem.name);

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

// モーダル制御用変数
let currentDetailKey: string | null = null;

// モーダルを開く
function openDetailModal(key: string) {
  currentDetailKey = key;  // モーダルタイトルをTodo名に変更
  const modalTitle = document.getElementById('detailModalTitle');
  if (modalTitle) {
    modalTitle.textContent = `詳細設定（${key}）`;
  }

  // 現在値を取得
  const todoItem = todoData.todoItems.filter(item => item.name === key)[0];
  const auto = todoItem?.detail?.autoCountupByTime;

  // チェックボックス・インターバル・加算値を反映
  const autoCountupCheckbox = document.getElementById('autoCountupCheckbox') as HTMLInputElement;
  const intervalInput = document.getElementById('intervalInput') as HTMLInputElement;
  const addValueInput = document.getElementById('addValueInput') as HTMLInputElement;

  if (autoCountupCheckbox) autoCountupCheckbox.checked = !!auto?.isActive;
  if (intervalInput) intervalInput.value = auto?.interval?.toString() ?? '1000';
  if (addValueInput) addValueInput.value = auto?.addnum?.toString() ?? '1';

  (document.getElementById('detailModal') as HTMLElement).style.display = 'flex';
}

// モーダルを閉じる
function closeDetailModal() {
  (document.getElementById('detailModal') as HTMLElement).style.display = 'none';
  currentDetailKey = null;
}

// モーダルのイベント設定
window.onload = () => {
  loadTodoItems();
  renderTodoList();

  const okBtn = document.getElementById('detailOkButton');
  const cancelBtn = document.getElementById('detailCancelButton');
  okBtn?.addEventListener('click', () => {
    if (!currentDetailKey) return;
    const autoCountup = (document.getElementById('autoCountupCheckbox') as HTMLInputElement).checked;
    const interval = parseInt((document.getElementById('intervalInput') as HTMLInputElement).value, 10);
    const addValue = parseInt((document.getElementById('addValueInput') as HTMLInputElement).value, 10);

    // detail情報を保存
    todoData.todoItems
      .filter(item => item.name === currentDetailKey)
      .forEach(item => {
        if (!item.detail) item.detail = {};
        const prevBase = item.detail.autoCountupByTime?.baseDatetime;
        const prevLast = item.detail.autoCountupByTime?.lastCheckDatetime;
        const now = Date.now();
        item.detail.autoCountupByTime = {
          isActive: autoCountup,
          interval: interval,
          addnum: addValue,
          baseDatetime: prevBase ?? now,
          lastCheckDatetime: prevLast ?? now,
        };
      });

    closeDetailModal();
    saveTodoItems();
    renderTodoList();
  });
  cancelBtn?.addEventListener('click', closeDetailModal);
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
  versionNum: string;
  todoItems: TodoItem[];
}

interface TodoItem {
  id: number;
  name: string;
  counter: number;
  // isComplate: boolean;
  detail?: Detail;
}

interface Detail {
  autoCountupByTime?: {
    isActive: boolean;
    interval?: number;
    addnum?: number;
    baseDatetime?: number;
    lastCheckDatetime?: number;
  }
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


