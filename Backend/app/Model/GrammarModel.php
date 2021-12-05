<?php
require_once './Backend/vendor/autoload.php';

use GuzzleHttp\Client;

function getGrammar(string $keyword, string $language = "es", int $max = 10) : string {
    $keyword = str_replace(" ", "+", $keyword);

    $http = new Client();

    $response = $http->request('GET', 'https://api.datamuse.com/words', [
        'query' => [
            'sl' => $keyword,
            'v' => $language,
            'max' => $max
        ]
    ]);
    
    return $response->getBody()->getContents();
}