<?php
require_once "../../lib/loader.php";

if (empty($_GET["acct"])) api_json(["error" => "ユーザID入れてくれ〜"]);
$acct = $_GET["acct"];
if (!filter_var($acct, FILTER_VALIDATE_EMAIL)) api_json(["error" => "ユーザIDじゃなくない？"]);

$mysqli = db_start();
$stmt = $mysqli->prepare("SELECT * FROM `get_icon` WHERE acct = ?;");
$stmt->bind_param("s", $acct);
$stmt->execute();
$row = db_fetch_all($stmt);
$stmt->close();
$mysqli->close();

if (empty($row[0]) || (time() - strtotime($row[0]["updated_at"])) > 60 * 60 * 24) {
  if (empty($row[0])) { // 初めてとる
    $id_s = api("/api/v2/search?q=" . $acct);
    if (empty($id_s)) api_json(["error" => "ユーザーがわからん (search)"]);
    $id_s = json_decode($id_s, true);
    if (empty($id_s["accounts"][0])) api_json(["error" => "ユーザーがわからん (出てこない)"]);
    $id_s = $id_s["accounts"][0];

    if ($id_s["acct"] === $id_s["username"]) $id_s["acct"] = $id_s["acct"] . "@" . $env["mastodon"]["domain"];
    if (mb_strtolower($acct) !== mb_strtolower($id_s["acct"])) api_json(["error" => "アカウント違うくない？"]);

    $id = $id_s["id"];
  } else {
    $id = $row[0]["id"];
  }
  $acct_s = api("/api/v1/accounts/" . $id);
  if (empty($acct_s)) api_json(["error" => "ユーザーがわからん (accounts)"]);
  $acct_s = json_decode($acct_s, true);
  if (empty($acct_s["avatar"]) || empty($acct_s["avatar_static"])) api_json(["error" => "アバターが出てこない"]);

  $mysqli = db_start();
  $stmt = $mysqli->prepare("INSERT INTO `get_icon` (id, acct, avatar, avatar_static) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE avatar = ?, avatar_static = ?, updated_at = CURRENT_TIMESTAMP;");

  $stmt->bind_param("ssssss", $id, $acct, $acct_s["avatar"], $acct_s["avatar_static"], $acct_s["avatar"], $acct_s["avatar_static"]);
  $stmt->execute();
  $stmt->close();
  $mysqli->close();

  $url = $acct_s["avatar"];
} else {
  $url = $row[0]["avatar"];
}

api_json(["url" => $url]);

function api($url) {
  global $env;

  $header = [
    'Authorization: Bearer ' . $env["mastodon"]["token"],
    'Content-Type: application/json'
  ];
  $options = ['http' => [
    'method' => 'GET',
    'header' => implode(PHP_EOL, $header)
  ]];
  $options = stream_context_create($options);
  return file_get_contents("https://" . $env["mastodon"]["domain"] . $url, false, $options);
}