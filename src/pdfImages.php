<?php

$pdfFooter = base64_encode(file_get_contents('../app/assets/imgs/pdfFooter.png'));
$pdfLogo = base64_encode(file_get_contents('../app/assets/imgs/vivid_logo.png'));
$pdfCTA = base64_encode(file_get_contents('../app/assets/imgs/footerCTA.png'));


$array["pdfLogo"]   = $pdfLogo;
$array["pdfFooter"] = $pdfFooter;
$array["pdfCTA"] = $pdfCTA;

$json = json_encode($array);


print_r($json);



?>