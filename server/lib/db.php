<?php
function db_start($ignore_error = false) {
    global $env;
    $mysqli = new mysqli($env["database"]["host"], $env["database"]["user"], $env["database"]["pass"], $env["database"]["db"], $env["database"]["port"]);
    if ($mysqli->connect_errno && !$ignore_error) {
        http_response_code(500);
        if ($env["is_testing"]) {
            var_dump($mysqli);
        }
        exit('Database Error');
    }
    $mysqli->set_charset("utf8mb4");
    return $mysqli;
}

function db_fetch_all(& $stmt) {
    $hits = [];
    $params = [];
    $meta = $stmt->result_metadata();
    while ($field = $meta->fetch_field()) {
        $params[] = &$row[$field->name];
    }
    call_user_func_array([$stmt, 'bind_result'], $params);
    while ($stmt->fetch()) {
        $c = [];
        foreach ($row as $key => $val) {
            $c[$key] = $val;
        }
        $hits[] = $c;
    }
    return $hits;
}