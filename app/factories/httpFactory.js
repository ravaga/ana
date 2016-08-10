'use strict';
var app = angular.module('analysisApp');
app.factory('httpFactory', function($http, resultService, scoreService){
    
    /*Speed Call Function*/
    var Speed = function($var)
    {
        var obj = config($var);
        $http.get(obj.speed)
            //success
            .then(function success(data){
            var responseData = data.data;
            
            var score = scoreService.getScore(responseData.test.score);
            
            var group = {
                    title:'Speed',
                    icon:score.icon,
                    label:score.flag,
                    sign:score.sign,
                    score:responseData.test.score,
                    alerts:responseData.alerts,
                    messages:responseData.messages,
            };
            
            resultService.addResults(group);
            console.log(group);
        },
            //error
            function error(err){
               console.log(err);
        });
        
    }
    
    /*Mobile Call function*/
    var Mobile = function($var)
    {
        var obj = config($var);
        $http.get(obj.mobile)
            .then(function success(data){
            var responseData = data.data;
            
            var score = scoreService.getScore(responseData.test.score);
            var imgData = cleanBase64(responseData.screenshot.data);
            
            var group = {
                    title:'Mobile',
                    icon:score.icon,
                    label:score.flag,
                    sign:score.sign,
                    score:responseData.test.score,
                    alerts:responseData.alerts,
                    messages:responseData.messages,
                    screenshot: {
                        data:imgData,
                        mime:responseData.screenshot.mime_type
                    }
            };
            resultService.addScreenshot(group.screenshot);
            resultService.addResults(group);
            console.log(group);
        },
            function error(err){
            //Do something
        });
        
    }
    
    var Markup = function($var)
    {
        var obj = config($var);
        $http.get(obj.markup)
            .then(function success(data){
            var responseData = data.data;
            
            var dataScore = (100 - responseData.messages.length);
            var score = scoreService.getScore(dataScore);
            var group = {
                    title:'Markup',
                    icon:score.icon,
                    label:score.flag,
                    sign:score.sign,
                    score:dataScore,
                    messages:responseData.messages,
                };
            console.log(group);
            resultService.addResults(group);
        },
            function error(err){
            //Do Something
        });
    }
    
    /*
     *  Tools
     */
    
    //clean base64 screenshot
    var cleanBase64 = function(data)
    {
        data = data.replace(/_/g,'/');
        data = data.replace(/-/g, '+');
        return data;
    }
    //get config routes
    var config = function($var)
    {
        var debugMode = false; 
                
        if(debugMode == false)
        {
            var siteTest = {
                    "speed": 'src/speed.php?url='+$var,
                    "mobile": 'src/mobile.php?url='+$var,
                    "markup":'src/markup.php?url='+$var,
                    };  
            }
            else
            {
                var siteTest = {
                        "speed": 'dev/static/speed.json',
                        "mobile": 'dev/static/mobile.json',
                        "markup":'dev/static/w3.json',
                    };
            }
    return siteTest;
    }
    
    
    
    return{
        Speed: Speed,
        Mobile: Mobile,
        Markup: Markup
    }
    
    
});