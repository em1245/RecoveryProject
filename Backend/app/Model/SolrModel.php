<?php
require_once './Backend/vendor/autoload.php';
require_once './Backend/app/Model/ConnectionModel.php';
error_reporting(0);

function postURL(string $url, int $level = 0) : bool {

    //generando el shell para indexar una pagina web
    pclose(popen(
        "start /B java -Dc=".CORE_NAME." -Ddata=web -Drecursive=$level -jar ./Backend/solr/example/exampledocs/post.jar $url", 
        "r"
    ));

    return true;
}

function getQuery(string $search, bool $facet = false) {
    $client = createClient();

    $query = $client->createSelect();
    $query->setQuery( 
        "fq=$search"
    );
    $query->setQueryDefaultField("description");

    //definiendo un campo para buscar
    if($facet) {
        $facetset = $query->getFacetSet();
        $facetset->createFacetField("description");
        $facetset->createFacetQuery($search);
    }

    try {
        $result = $client->execute($query);
        
        return $result->getResponse()->getBody();
    }catch (Exception $e) {
        return array("msg" => $e->getMessage());
    }
}
