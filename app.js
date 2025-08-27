// app.ts
var tasks = [];
var DATA_KEY = "CounterData";
var VERSION_NUM = "0.0.2";
var counterData = {
  versionNum: VERSION_NUM,
  counterItems: [],
};
var idNum = 0;
function renderCounterList() {
  // カウンターリストを(再)表示する
  var counterList = document.getElementById("counterList");
  // --- 自動加算処理 ---
  var now = Date.now();
  counterData.counterItems.forEach(function (counterItem) {
    var _a;
    var detail = counterItem.detail;
    var auto =
      detail === null || detail === void 0 ? void 0 : detail.autoCountupByTime;
    if (
      (auto === null || auto === void 0 ? void 0 : auto.isActive) &&
      auto.interval &&
      auto.addnum &&
      auto.baseDatetime
    ) {
      // lastCheckDatetimeがなければbaseDatetimeを使う
      var lastChecked =
        (_a = auto.lastCheckDatetime) !== null && _a !== void 0
          ? _a
          : auto.baseDatetime;
      // 現在時刻までに何回加算すべきか計算
      var elapsed = now - lastChecked;
      var times = Math.floor(elapsed / auto.interval);
      if (times > 0) {
        counterItem.counter += times * auto.addnum;
        // lastCheckDatetimeを更新
        if (counterItem.detail && counterItem.detail.autoCountupByTime) {
          counterItem.detail.autoCountupByTime.lastCheckDatetime =
            lastChecked + times * auto.interval;
        }
      }
    }
  });
  saveCounterItems();
  if (counterList) {
    counterList.innerHTML = "";
    counterData.counterItems.forEach(function (counterItem) {
      var li = document.createElement("li");
      var span = document.createElement("span");
      span.textContent = counterItem.name;
      var span1 = document.createElement("span");
      span1.textContent = counterItem.counter.toString();
      var countUpButton = document.createElement("button");
      countUpButton.textContent = "+";
      countUpButton.className = "add-button";
      countUpButton.onclick = function () {
        return countUp(counterItem.name);
      };
      var countDownButton = document.createElement("button");
      countDownButton.textContent = "-";
      countDownButton.className = "sub-button";
      countDownButton.onclick = function () {
        return countDown(counterItem.name);
      };
      // Detailボタン追加
      var detailButton = document.createElement("button");
      detailButton.textContent = "Detail";
      detailButton.className = "detail-button";
      detailButton.onclick = function () {
        return openDetailModal(counterItem.name);
      };
      var deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.className = "delete-button";
      deleteButton.onclick = function () {
        return deleteCounter(counterItem.name);
      };
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
function countUp(key) {
  counterData.counterItems
    .filter(function (item) {
      return item.name === key;
    })
    .forEach(function (item) {
      item.counter += 1;
    });
  saveCounterItems();
  renderCounterList();
}
function countDown(key) {
  counterData.counterItems
    .filter(function (item) {
      return item.name === key;
    })
    .forEach(function (item) {
      item.counter -= 1;
    });
  saveCounterItems();
  renderCounterList();
}
// モーダル制御用変数
var currentDetailKey = null;
// モーダルを開く
function openDetailModal(key) {
  var _a, _b, _c, _d, _e;
  currentDetailKey = key; // モーダルタイトルをカウンター名に変更
  var modalTitle = document.getElementById("detailModalTitle");
  if (modalTitle) {
    modalTitle.textContent = "\u8A73\u7D30\u8A2D\u5B9A\uFF08".concat(
      key,
      "\uFF09"
    );
  }
  // 現在値を取得
  var counterItem = counterData.counterItems.filter(function (item) {
    return item.name === key;
  })[0];
  var auto =
    (_a =
      counterItem === null || counterItem === void 0
        ? void 0
        : counterItem.detail) === null || _a === void 0
      ? void 0
      : _a.autoCountupByTime;
  // チェックボックス・インターバル・加算値を反映
  var autoCountupCheckbox = document.getElementById("autoCountupCheckbox");
  var intervalInput = document.getElementById("intervalInput");
  var addValueInput = document.getElementById("addValueInput");
  if (autoCountupCheckbox)
    autoCountupCheckbox.checked = !!(auto === null || auto === void 0
      ? void 0
      : auto.isActive);
  if (intervalInput)
    intervalInput.value =
      (_c =
        (_b = auto === null || auto === void 0 ? void 0 : auto.interval) ===
          null || _b === void 0
          ? void 0
          : _b.toString()) !== null && _c !== void 0
        ? _c
        : "1000";
  if (addValueInput)
    addValueInput.value =
      (_e =
        (_d = auto === null || auto === void 0 ? void 0 : auto.addnum) ===
          null || _d === void 0
          ? void 0
          : _d.toString()) !== null && _e !== void 0
        ? _e
        : "1";
  document.getElementById("detailModal").style.display = "flex";
}
// モーダルを閉じる
function closeDetailModal() {
  document.getElementById("detailModal").style.display = "none";
  currentDetailKey = null;
}
// モーダルのイベント設定
window.onload = function () {
  loadCounterItems();
  renderCounterList();
  var okBtn = document.getElementById("detailOkButton");
  var cancelBtn = document.getElementById("detailCancelButton");
  okBtn === null || okBtn === void 0
    ? void 0
    : okBtn.addEventListener("click", function () {
        if (!currentDetailKey) return;
        var autoCountup = document.getElementById(
          "autoCountupCheckbox"
        ).checked;
        var interval = parseInt(
          document.getElementById("intervalInput").value,
          10
        );
        var addValue = parseInt(
          document.getElementById("addValueInput").value,
          10
        );
        // detail情報を保存
        counterData.counterItems
          .filter(function (item) {
            return item.name === currentDetailKey;
          })
          .forEach(function (item) {
            var _a, _b;
            if (!item.detail) item.detail = {};
            var prevBase =
              (_a = item.detail.autoCountupByTime) === null || _a === void 0
                ? void 0
                : _a.baseDatetime;
            var prevLast =
              (_b = item.detail.autoCountupByTime) === null || _b === void 0
                ? void 0
                : _b.lastCheckDatetime;
            var now = Date.now();
            item.detail.autoCountupByTime = {
              isActive: autoCountup,
              interval: interval,
              addnum: addValue,
              baseDatetime:
                prevBase !== null && prevBase !== void 0 ? prevBase : now,
              lastCheckDatetime:
                prevLast !== null && prevLast !== void 0 ? prevLast : now,
            };
          });
        closeDetailModal();
        saveCounterItems();
        renderCounterList();
      });
  cancelBtn === null || cancelBtn === void 0
    ? void 0
    : cancelBtn.addEventListener("click", closeDetailModal);
};
function deleteCounter(key) {
  counterData.counterItems = counterData.counterItems.filter(function (item) {
    return item.name !== key;
  });
  saveCounterItems();
  renderCounterList();
}
function addCounter() {
  // カウンターを追加する
  var counterInput = document.getElementById("counterInput");
  var newTask = counterInput.value.trim();
  if (newTask !== "") {
    var counterItem = { id: ++idNum, name: newTask, counter: 0 };
    counterData.counterItems.push(counterItem);
    tasks.push(newTask);
    counterInput.value = "";
    saveCounterItems();
    renderCounterList();
  }
}
function saveCounterItems() {
  // counterData をローカルストレージに保存する
  var jsonData = JSON.stringify(counterData);
  console.log("save data:" + jsonData);
  localStorage.setItem(DATA_KEY, jsonData);
}
function loadCounterItems() {
  // counterData をローカルストレージからロードする
  var jsonData = localStorage.getItem(DATA_KEY);
  console.log("load data:" + jsonData);
  if (jsonData) {
    counterData = JSON.parse(jsonData);
  }
}
// 初期化
loadCounterItems();
renderCounterList();
