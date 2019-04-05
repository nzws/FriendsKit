# FriendsKit

friends.nico の独自機能を再現するユーザスクリプトです。

[Knzk.me](https://knzk.me/) に対応しています。

- [x] お気に入りアイコン変更
- [x] お気に入りアイコン拡大モード
- [x] @ピザ
- [x] キーワードハイライト
- [x] ユーザー絵文字機能
- [x] nico.msリンク生成

## インストール

[Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=ja) をインストールして、下記のリンクからFriendsKitをインストールしてください。

https://greasyfork.org/ja/scripts/381132-friendskit

**使用時に次のようなページが表示される場合があります。**   
その場合は、 **常にすべてのドメインを許可** をクリックしてください。

![Imgur](https://i.imgur.com/BxsOhbQ.png)

> これは、FriendsKit がユーザ絵文字のアイコンを検索するためのサーバに接続したり、お気に入りアイコンを参照するために必要となります。

## 使い方とか

#### ユーザー絵文字

:_(ユーザーID): で入力してください (`@` ではなく `_` なのはメンションしてしまう為です)

#### 設定

`getting-started` に行くと、下の方に小さく `FriendsKit CP` というのが増えているのでクリックすると設定画面が開けます。

![Imgur](https://i.imgur.com/ya9RJDu.png)

## FAQ

#### 〇〇の機能が実装されてない, 動かない！

[y@knzk.me](https://knzk.me/@y) までどうぞ

#### Knzk.me でしか使用できないのはなぜ？

1つめの理由として、ユーザースクリプトはいわば非公式改造みたいなものなので適用してるサイトがアップデートされると高確率で動かなくなります。(Mastodonで言えば、バージョンが違うと動きません)   
そのため、サポートできる範囲を絞るために1つのインスタンスに制限しています。

また、2つめの理由としてはデフォルトの補助サーバ(friendskit.nzws.me)が Knzk.me に依存しているためです。

#### 設定ミスって動かなくなった！

画像URLを適当に設定してしまうとロード時に画像読み込みでコケてロードされなくなってしまうようです。  
応急処置として、DevToolsから `friendskit.resetSettings();` コマンドを使用して設定をリセットしてください。

## ライセンス

MPL-2.0

*権利者の方へ: 問題があれば削除しますので、 @dwango に所属されている方か friends.nico 運営だったとわかる方からこのリポジトリに対してissueを送信してください。*
