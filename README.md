# pitang-movie-list

Airtable に登録した映画の一覧とレビューを表示する Astro 製の静的サイトです。Netlify でビルド・公開しています。

## セットアップ

```sh
npm install
```

プロジェクト直下に `.env` を作り、次の環境変数を設定します。Netlify では同じ変数をサイトの環境変数に登録します。

| 変数                  | 内容                                   |
| :-------------------- | :------------------------------------- |
| `AIRTABLE_API_KEY`    | Airtable のアクセストークン            |
| `AIRTABLE_BASE_ID`    | 映画データのベース ID                  |
| `AIRTABLE_TABLE_NAME` | 映画データのテーブル名                 |
| `TMDB_API_TOKEN`      | TMDb の API 読み取りアクセストークン   |

どれかが欠けている場合、Netlify ではビルドが失敗します。手元では画像のダウンロードだけを飛ばして続行するため、画像が表示されません。

## 画像の仕組み

`npm run dev` と `npm run build` は、最初に [scripts/download-images.mjs](scripts/download-images.mjs) を実行します。

- 映画ごとに TMDb を「タイトル＋年 → slug＋年 → タイトルのみ」の順で検索し、横長の背景画像（なければポスター）を `public/images/movies/<slug>.jpg` に保存します。
- 保存済みの画像は取り直しません。画像を入れ替えたいときは、そのファイルを消してから実行します。
- `public/images/` は Git の管理外です。Netlify では毎回すべて取り直します。
- TMDb で見つからなかった映画は、画像なしで表示されます。

## コマンド

| コマンド          | 内容                                             |
| :---------------- | :----------------------------------------------- |
| `npm run dev`     | 画像を取得してから開発サーバーを起動（`localhost:4321`） |
| `npm run build`   | 画像を取得してから `./dist/` にビルド            |
| `npm run preview` | ビルド結果を手元で確認                           |

画像は [TMDB](https://www.themoviedb.org/) から提供されています。This product uses the TMDB API but is not endorsed or certified by TMDB.
