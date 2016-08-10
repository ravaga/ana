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
        echo("Huston, we have a problem with the url parameter. ... kshhh ....  over... ");   
    }


?>


