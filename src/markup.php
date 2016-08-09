<?php
    
    require('api.Class.php');
    analize::init("apiConfig.json");

    if(isset($_GET["url"]))
    {
        $w3_response = analize::w3HTML($_GET["url"]);
        print_r($w3_response);   
    }
    else
    {
        echo("<pre>Something's wrong</pre>");
    }

?>