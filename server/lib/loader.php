<?php
$confpath = __DIR__ . "/../config.php";
date_default_timezone_set('Asia/Tokyo');

if (file_exists($confpath)) {
  require_once $confpath;
} else {
  http_response_code(500);
  exit("SERVER ERROR: Config file is not found");
}

if ($env["is_testing"]) {
  ini_set('display_errors', 1);
}

if (isset($_SERVER["HTTP_CF_CONNECTING_IP"])) {
  $_SERVER["REMOTE_ADDR"] = $_SERVER["HTTP_CF_CONNECTING_IP"];
}

$libpt = __DIR__ . "/";
require_once $libpt . "db.php";

if ($env["is_maintenance"]) exit("503: maintenance");

function api_json($data) {
  header("Content-Type: application/json; charset=utf-8");
  echo json_encode($data, true);
  exit();
}