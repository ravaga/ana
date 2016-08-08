<?php
    

  require('api.Class.php');
    analize::init("apiConfig.json");

    if(isset($_GET["url"]))
    {
        $speed_response = analize::speed($_GET["url"]);
        print_r($speed_response);   
    }
    else
    {
        echo("<pre>Something's wrong</pre>");
    }


?>


