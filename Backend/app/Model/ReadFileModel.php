<?php

function getInfoText(string $route) : array {
    try {
        $string = file_get_contents($route);
        return explode("\n", $string);
    }catch(Exception $e) {
        echo $e->getMessage();
    }
}

function getInfoJson(string $route) : array {
    try {
        $jsonRaw = file_get_contents($route);
        return json_decode($jsonRaw); 
    }catch(Exception $e) {
        echo $e->getMessage();
    }
}