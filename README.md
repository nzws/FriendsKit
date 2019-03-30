# FriendsKit

friends.nico の独自機能を再現するユーザスクリプトです。 **開発中です。**

[Knzk.me](https://knzk.me/) に対応しています。

- [x] お気に入りアイコン変更
- [x] お気に入りアイコン拡大モード
- [x] @ピザ
- [x] キーワードハイライト
- [x] ユーザー絵文字機能
- [ ] nico.msリンク生成

## インストール

[Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=ja) をインストールして、下記のリンクからFriendsKitをインストールしてください。

https://greasyfork.org/ja/scripts/381132-friendskit

**使用時に次のようなページが表示される場合があります。**   
その場合は、 **常にすべてのドメインを許可** をクリックしてください。

![Imgur](https://i.imgur.com/BxsOhbQ.png)

> これは、FriendsKit がユーザ絵文字のアイコンを検索するためのサーバに接続したり、お気に入りアイコンを参照するために必要となります。

## 使い方とか

#### お気に入りアイコン変更

権利上の問題で画像自体は同梱・有効化されていません。   
次のコードを使用して参照する画像を設定してください。
```javascript
friendskit.changeSettings('fav_icon', 'https://example.com/hogehoge.png(ここのURLをいじる)'); // アクティブ(明るい方) の画像URLを指定
friendskit.changeSettings('fav_icon_gray', 'https://example.com/hogehoge-gray.png(ここのURLをいじる)'); // 暗い方 の画像URLを指定
```

#### ユーザー絵文字

:_(ユーザーID): で入力してください (`@` ではなく `_` なのはメンションしてしまう為です)

#### 設定

F12 を押して Console を開いてください。 ~~設定画面作るのが面倒だったとか言えない~~

![Imgur](https://i.imgur.com/BiSrNsr.png)

下記の設定一覧を参考にしてコードを入力してEnterを押せば設定できます。

## 設定一覧

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
friendskit.changeSettings('fav_icon', 'https://example.com/hogehoge.png(ここのURLをいじる)'); // アクティブ(明るい方) の画像URLを指定
friendskit.changeSettings('fav_icon_gray', 'https://example.com/hogehoge-gray.png(ここのURLをいじる)'); // 暗い方 の画像URLを指定

// お気に入りボタンを元に戻す
friendskit.changeSettings('fav_icon');
friendskit.changeSettings('fav_icon_gray');


// お気に入りアイコン拡大モードを無効にする
friendskit.changeSettings('no_fav_icon_big', 1);

// お気に入りアイコン拡大モードを有効にする
friendskit.changeSettings('no_fav_icon_big');


// 補助サーバを変更
friendskit.changeSettings('api_server', 'https://example.com/');


// FriendsKit設定のエクスポート
friendskit.exportSettings();
// コードがクリップボードにコピーされます
```

## FAQ

#### 〇〇の機能が実装されてない, 動かない！

[y@knzk.me](https://knzk.me/@y) までどうぞ

#### Knzk.me でしか使用できないのはなぜ？

1つめの理由として、ユーザースクリプトはいわば非公式改造みたいなものなので適用してるサイトがアップデートされると高確率で動かなくなります。(Mastodonで言えば、バージョンが違うと動きません)   
そのため、サポートできる範囲を絞るために1つのインスタンスに制限しています。

また、2つめの理由としてはデフォルトの補助サーバ(friendskit.nzws.me)が Knzk.me に依存しているためです。

## ライセンス

MPL-2.0

*権利者の方へ: 問題があれば削除しますので、 @dwango に所属されている方か friends.nico 運営だったとわかる方からこのリポジトリに対してissueを送信してください。*