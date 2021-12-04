<?php
require_once './Backend/app/init.php';

use Solarium\Client;

$client = new Client($adapter, $eventDispatcher, $config);

$ping = $client->createPing();

try {
    var_dump($client->ping($ping)->getData());
}catch(Exception $e) {
    var_dump($e->getMessage());
}
