//
// キーワードハイライト
//

// キーワードハイライトを追加
friendskit.keyword.add('ハイライトさせたいワード');

// キーワードハイライトを削除
friendskit.keyword.remove('させたくないワード');

// キーワードハイライトの一覧
friendskit.keyword.list();

// キーワードハイライトをリセット
friendskit.keyword.reset();


//
// お気に入りアイコン
//

// 設定の優先度
// default_force > char > fav_icon > nicoru

// お気に入りアイコンを設定に関わらず強制的にデフォルト(星)にする
friendskit.changeSettings('fav_icon_default_force', 1);

// デフォルトにしない
friendskit.changeSettings('fav_icon_default_force');


// 文字にする (1~2文字くらい)
friendskit.changeSettings('fav_icon_char', '南無');

// 設定を消す
friendskit.changeSettings('fav_icon_char');


// お気に入りアイコンを特定の画像にする
friendskit.changeSettings('fav_icon', 'https://example.com/hogehoge.png(ここのURLをいじる)'); // アクティブ(明るい方) の画像URLを指定
friendskit.changeSettings('fav_icon_gray', 'https://example.com/hogehoge-gray.png(ここのURLをいじる)'); // 暗い方 の画像URLを指定

// 設定を消す
friendskit.changeSettings('fav_icon');
friendskit.changeSettings('fav_icon_gray');


//
// お気に入りアイコン拡大
//

// お気に入りアイコン拡大モードを無効にする
friendskit.changeSettings('no_fav_icon_big', 1);

// お気に入りアイコン拡大モードを有効にする
friendskit.changeSettings('no_fav_icon_big');


//
// その他
//

// 補助サーバを変更
friendskit.changeSettings('api_server', 'https://example.com/');

// FriendsKit設定のエクスポート
friendskit.exportSettings();
// コードがクリップボードにコピーされます