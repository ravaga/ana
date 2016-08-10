<?php


/*
    SITE ANALYSIS CLASS
*/

class analize{
    
    public static $config;
    
    //init
    public static function init($path)
	{
		if(isset(self::$config))
		{
			trigger_error("analize library not found...", E_USER_ERROR);
		}
		if(!is_file($path))
		{
			trigger_error("analize library not found {$path}",E_USER_ERROR);
		}
		
		$content = file_get_contents($path);
		if($content == false)
		{
			trigger_error("could not read {$path}", E_USER_ERROR);
		}
		$config = json_decode($content, true);
		if(is_null($config))
		{
			trigger_error("could not decode {$path}");
		}
		self::$config = $config;
		
		
	}

    
    //checks for site load speed
    public static function speed($foo)
    {
        //sanity check
        if($foo == NULL)
            return false;
        //encode parameter
        $get = urlencode($foo);
        //give form to url
        $url = self::$config["apis"]["speed"].$get;
        //init curl
        $curl = curl_init($url);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, TRUE);
        $result = curl_exec($curl);
        $info = curl_getinfo($curl);
        curl_close($curl);
        if(!$result)
            return false;
        //decode response 
        $array = json_decode($result, true);
        //select what we need
        $speed = $array["ruleGroups"]["SPEED"];
        $messages = $array["formattedResults"]["ruleResults"];
        $stats = $array["pageStats"];
        $time = $info["total_time"];
        
        
        $group = [
            "test"=> $speed,
            "total_time"=>$time,
            "alerts"=> count($messages),
            "stats"=> $stats,
            "messages"=> $messages,
            
        ];
        
        //encode result
        $json = json_encode($group, true);
        //return json
        return $json;  
   
    }
    
    //check for mobile usability
    public static function mobile($foo)
    {
        //sanity check
        if($foo == NULL)
            return false;
        //encode parameter
        $get = urlencode($foo);
        //give form to url
        $url = self::$config["apis"]["mobile"].$get;
        //init curl
        $curl = curl_init($url);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, TRUE);
        $result = curl_exec($curl);
        $info = curl_getinfo($curl);
        curl_close($curl);
        if(!$result)
            return false;
        //decode response 
        $array = json_decode($result, true);
        
        //select what we need
        $mobile = $array["ruleGroups"]["USABILITY"];
        $messages = $array["formattedResults"]["ruleResults"];
        $screenshot = $array["screenshot"];
        $time = $info["total_time"];
        
        $group = [
            "test"=> $mobile,
            "total_time"=>$time,
            "alerts"=> count($messages),
            "messages"=> (array)$messages,
            "screenshot"=>$screenshot
            
        ];
        
        
        //encode result
        $json = json_encode($group, true);
        //return json
        return $json; 
    }
    
    //calls w3 html validator
    public static function w3HTML($foo)
    {
      
        //spesify json output  &out=json
        $get = urlencode($foo);
        $url = self::$config["apis"]["w3HTML"].$get."&out=json";
        // Initializing curl
        $curl = curl_init( $url );
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, TRUE);
        // Getting results
        $result =  curl_exec($curl);
        $info = curl_getinfo($curl);
        curl_close($curl);
        if(!$result)
        {
            return false;
        }
        
        //return
        return $result;  
        
    }
    
    
    //calls api for screenshots, 
    //* $foo = screenshot size width,height
    //* $var = screenshot url
  
    
    
}

?>