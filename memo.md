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


## todo
tsc-watch を試す