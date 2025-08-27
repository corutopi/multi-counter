// app.ts
let tasks: string[] = [];
const DATA_KEY = 'CounterData'
const VERSION_NUM = '0.0.2'
var counterData: CounterData = {
  versionNum: VERSION_NUM,
  counterItems: []
};
var idNum: number = 0


function renderCounterList() {
  // カウンターリストを(再)表示する
  const counterList = document.getElementById('counterList');

  // --- 自動加算処理 ---
  const now = Date.now();
  counterData.counterItems.forEach(counterItem => {
    const detail = counterItem.detail;
    const auto = detail?.autoCountupByTime;
    if (auto?.isActive && auto.interval && auto.addnum && auto.baseDatetime) {
      // lastCheckDatetimeがなければbaseDatetimeを使う
      const lastChecked = auto.lastCheckDatetime ?? auto.baseDatetime;
      // 現在時刻までに何回加算すべきか計算
      const elapsed = now - lastChecked;
      const times = Math.floor(elapsed / auto.interval);
      if (times > 0) {
        counterItem.counter += times * auto.addnum;
        // lastCheckDatetimeを更新
        if (counterItem.detail && counterItem.detail.autoCountupByTime) {
          counterItem.detail.autoCountupByTime.lastCheckDatetime = lastChecked + times * auto.interval;
        }
      }
    }
  });
  saveCounterItems();

  if (counterList) {
    counterList.innerHTML = '';
    counterData.counterItems.forEach(counterItem => {
      const li = document.createElement('li');

      const span = document.createElement('span');
      span.textContent = counterItem.name;

      const span1 = document.createElement('span');
      span1.textContent = counterItem.counter.toString();

      const countUpButton = document.createElement('button');
      countUpButton.textContent = '+';
      countUpButton.className = 'add-button'
      countUpButton.onclick = () => countUp(counterItem.name);

      const countDownButton = document.createElement('button');
      countDownButton.textContent = '-';
      countDownButton.className = 'sub-button'
      countDownButton.onclick = () => countDown(counterItem.name);

      // Detailボタン追加
      const detailButton = document.createElement('button');
      detailButton.textContent = 'Detail';
      detailButton.className = 'detail-button';
      detailButton.onclick = () => openDetailModal(counterItem.name);

      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.className = 'delete-button'
      deleteButton.onclick = () => deleteCounter(counterItem.name);

      li.appendChild(span);
      li.appendChild(span1);
      li.appendChild(countUpButton);
      li.appendChild(countDownButton);
      li.appendChild(detailButton);
      li.appendChild(deleteButton);
      counterList.appendChild(li);
      idNum = Math.max(idNum, counterItem.id);
    });
  }
}

function countUp(key: string){
  counterData.counterItems
    .filter(item => item.name === key)
    .forEach(item => { item.counter += 1 });
  saveCounterItems();
  renderCounterList();
}

function countDown(key: string){
  counterData.counterItems
    .filter(item => item.name === key)
    .forEach(item => { item.counter -= 1 });
  saveCounterItems();
  renderCounterList();
}

// モーダル制御用変数
let currentDetailKey: string | null = null;

// モーダルを開く
function openDetailModal(key: string) {
  currentDetailKey = key;  // モーダルタイトルをカウンター名に変更
  const modalTitle = document.getElementById('detailModalTitle');
  if (modalTitle) {
    modalTitle.textContent = `詳細設定（${key}）`;
  }

  // 現在値を取得
  const counterItem = counterData.counterItems.filter(item => item.name === key)[0];
  const auto = counterItem?.detail?.autoCountupByTime;

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
  loadCounterItems();
  renderCounterList();

  const okBtn = document.getElementById('detailOkButton');
  const cancelBtn = document.getElementById('detailCancelButton');
  okBtn?.addEventListener('click', () => {
    if (!currentDetailKey) return;
    const autoCountup = (document.getElementById('autoCountupCheckbox') as HTMLInputElement).checked;
    const interval = parseInt((document.getElementById('intervalInput') as HTMLInputElement).value, 10);
    const addValue = parseInt((document.getElementById('addValueInput') as HTMLInputElement).value, 10);

    // detail情報を保存
    counterData.counterItems
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
    saveCounterItems();
    renderCounterList();
  });
  cancelBtn?.addEventListener('click', closeDetailModal);
}

function deleteCounter(key: string) {
  counterData.counterItems = counterData.counterItems.filter(item => item.name !== key);
  saveCounterItems();
  renderCounterList();
}

function addCounter() {
  // カウンターを追加する
  const counterInput = document.getElementById('counterInput') as HTMLInputElement;
  const newTask = counterInput.value.trim();
  if (newTask !== '') {
    const counterItem: CounterItem = {id: ++idNum, name: newTask, counter: 0}
    counterData.counterItems.push(counterItem)
    tasks.push(newTask);
    counterInput.value = '';
    saveCounterItems();
    renderCounterList();
  }
}

interface CounterData {
  versionNum: string;
  counterItems: CounterItem[];
}

interface CounterItem {
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

function saveCounterItems() {
  // counterData をローカルストレージに保存する
  const jsonData = JSON.stringify(counterData);
  console.log("save data:" + jsonData);
  localStorage.setItem(DATA_KEY, jsonData);
}

function loadCounterItems() {
  // counterData をローカルストレージからロードする
  const jsonData = localStorage.getItem(DATA_KEY)
  console.log("load data:" + jsonData)
  if (jsonData) {
    counterData = JSON.parse(jsonData)
  }
}

// 初期化
loadCounterItems();
renderCounterList();


