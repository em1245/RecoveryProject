<?php
require_once './Backend/vendor/autoload.php';
require_once './Backend/app/Constant.php';

use Solarium\Client;
use Solarium\Core\Client\Adapter\Curl;
use Symfony\Component\EventDispatcher\EventDispatcher;

function startSolr() {
    try {
        shell_exec(".\Backend\solr\bin\solr start");
        return "el servicio está encendido";
    }catch(Exception $e) {
        return "servicio no encendido";
    }
}

function stopSolr() {
    try {
        shell_exec(".\Backend\solr\bin\solr stop -all");
        return "el servicio se detuvo correctamente";
    }catch(Exception $e) {
        return "el servicio no se pudo detener";
    }
}

function createCore() : mixed {
    try {
        shell_exec(".\Backend\solr\bin\solr create_core -c ".CORE_NAME);
        return "core ".CORE_NAME." creado";
    }catch(Exception $e) {
        return "core no creado";
    }
}

function createClient() : Client {
    $adapter = new Curl();
    $eventDispatcher = new EventDispatcher();
    $config = array(
        'endpoint' => array(
            'localhost' => array(
                'host' => HOST,
                'port' => PORT,
                'path' => '/',
                'core' => CORE_NAME
            )
        )
    );

    return new Client($adapter, $eventDispatcher, $config);
}

function checkConnection() : bool {
    $client = createClient();
    $ping = $client->createPing();

    try {
        $client->ping($ping)->getData();
        return true;
    }catch(Exception $e) {
        return false;
    }
}