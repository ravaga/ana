'use strict';
var app = angular.module('analysisApp');
app.factory('CallFactory', function($http, resultService, scoreService){
    
    /*Speed Call Function*/
    var Speed = function($var)
    {
        var obj = config($var);
        $http.get(obj.speed)
            //success
            .success(function(data){
            
            var score = scoreService.getScore(data.test.score);
            
            var group = {
                    title:'Speed',
                    icon:score.icon,
                    label:score.flag,
                    sign:score.sign,
                    score:data.test.score,
                    alerts:data.alerts,
                    messages:data.messages,
            };
            
            resultService.addResults(group);
            console.log(group);
        })
            //error
            .error(function(data){
            
        });
        
    }
    
    /*Mobile Call function*/
    var Mobile = function($var)
    {
        var obj = config($var);
        $http.get(obj.mobile)
            .success(function(data){
            var score = scoreService.getScore(data.test.score);
            var imgData = cleanBase64(data.screenshot.data);
            
            var group = {
                    title:'Mobile',
                    icon:score.icon,
                    label:score.flag,
                    sign:score.sign,
                    score:data.test.score,
                    alerts:data.alerts,
                    messages:data.messages,
                    screenshot: {
                        data:imgData,
                        mime:data.screenshot.mime_type
                    }
            };
            resultService.addScreenshot(group.screenshot);
            resultService.addResults(group);
            console.log(group);
        })
            .error(function(err){
            //Do something
        });
        
    }
    
    var Markup = function($var)
    {
        var obj = config($var);
        $http.get(obj.markup)
            .success(function(data){
            var dataScore = (100 - data.messages.length);
            var score = scoreService.getScore(dataScore);
            var group = {
                    title:'Markup',
                    icon:score.icon,
                    label:score.flag,
                    sign:score.sign,
                    score:dataScore,
                    messages:data.messages,
                };
            console.log(group);
            resultService.addResults(group);
        })
            .error(function(err){
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