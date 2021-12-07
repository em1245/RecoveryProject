<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
header("Access-Control-Allow-Methods: GET, POST");
header('Content-Type: application/json');

require_once './Backend/app/Model/SolrModel.php';
require_once './Backend/app/Model/GrammarModel.php';
require_once './Backend/app/Model/ConnectionModel.php';

if(isset($_GET['crawler'])) {
    $url = $_GET['crawler'];
    $level = $_GET['level'] ? $_GET['level'] : 0;

    $response = postURL($url);

    echo json_encode(["msg" => $response]);
}

if(isset($_GET['create_core'])) {
    $response = createCore();

    echo json_encode(["message" => $response]);
}

if(isset($_GET['search'])) {
    $search = $_GET['search'];
    $facet = $_GET['facet'] ? true : false;

    $response = getQuery($search, $facet);

    echo $response;
}

if(isset($_GET['grammar'])) {
    $grammar = $_GET['grammar'];

    if(isset($_GET['v'])) {
        $v = $_GET['v'];
        $response = getGrammar($grammar, $v);
    }else {
        $response = getGrammar($grammar);
    }

    echo $response;
}