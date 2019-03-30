# FriendsKit

friends.nico の独自機能を再現するユーザスクリプトです。

- [x] お気に入りアイコン変更
- [x] お気に入りアイコン拡大モード
- [x] @ピザ
- [x] キーワードハイライト
- [ ] ユーザー絵文字機能
- [ ] nico.msリンク生成

## インストール

[Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=ja) をインストールして、下記のリンクからFriendsKitをインストールしてください。

## 使い方とか

wip

## 設定一覧

F12 を押して Console を開いてください。

**設定変更後はページリロードが必要です。**

```javascript
// キーワードハイライトを追加
friendskit.keyword.add('ハイライトさせたいワード');

// キーワードハイライトを削除
friendskit.keyword.remove('させたくないワード');

// キーワードハイライトの一覧
friendskit.keyword.list();

// キーワードハイライトをリセット
friendskit.keyword.reset();


// お気に入りボタンを特定の画像にする
friendskit.changeSettings('fav_icon', 'https://example.com/hogehoge.svg(ここのURLをいじる)'); // アクティブ(明るい方) の画像URLを指定
friendskit.changeSettings('fav_icon_gray', 'https://example.com/hogehoge-gray.svg(ここのURLをいじる)'); // 暗い方 の画像URLを指定

// お気に入りボタンを元に戻す
friendskit.changeSettings('fav_icon');
friendskit.changeSettings('fav_icon_gray');


// お気に入りアイコン拡大モードを有効にする
friendskit.changeSettings('fav_icon_big', 1);

// お気に入りアイコン拡大モードを無効にする
friendskit.changeSettings('fav_icon_big');


// ユーザー絵文字取得元を変更 (普通は変更しなくて良い)
friendskit.changeSettings('user_emoji_baseurl', 'https://example.com/hogehogeapi/');
// このURLの後に user@domain 形式のIDが入力された状態でリクエストします


// FriendsKit設定のエクスポート
friendskit.exportSettings();
// コードがクリップボードにコピーされます
```

## ライセンス

MPL-2.0

*権利者の方へ: 問題があれば削除しますので、 @dwango に所属されているユーザか friends.nico 運営だったとわかる方からこのリポジトリに対してissueを送信してください。*