## 構築手順
```bash
## Node.js と npm インストール
# バージョン確認
node --version

# プロジェクトフォルダ初期化
npm init -y

# ライブラリインストール(typescript)
npm install typescript --save-dev
```

## ローカル実行方法
```bash
# TypeScriptコンパイル
npx tsc app.ts

# live-server起動
npx live-server
```

## ローカルストレージのクリア
```js
localStorage.clear();
```

## todo
- tsc-watch を試す
- -ボタンを実装する
- 詳細設定画面を作る
    - タイマーでカウントアップする機能を作る
    - カウントアップ/カウントダウンの数値を変えられるようにする
    - 現在の値を変更できるようにする
    - タイトルを変更できるようにする
- 順序を変更できるようにする
- タイトルを変える
- 公開する(github-io or S3)