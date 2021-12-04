<?php
use Solarium\Core\Client\Adapter\Curl;
use Symfony\Component\EventDispatcher\EventDispatcher;

error_reporting(E_ALL);
ini_set('display_errors', true);

require_once './Backend/vendor/autoload.php';

$adapter = new Curl();
$eventDispatcher = new EventDispatcher();
$config = array(
    'endpoint' => array(
        'localhost' => array(
            'host' => '127.0.0.1',
            'port' => 8983,
            'path' => '/',
            'core' => 'techproducts'
        )
    )
);