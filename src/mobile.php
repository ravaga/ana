<?php
    

    require('api.Class.php');
    analize::init("apiConfig.json");

    if(isset($_GET["url"]))
    {
        $mobile_response = analize::mobile($_GET["url"]);
        print_r($mobile_response);   
    }
    else
    {
        echo("<pre>Something's wrong</pre>");
    }


?>