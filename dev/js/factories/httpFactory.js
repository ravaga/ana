(function(){
    'use strict';
    
    var app = angular.module('analysisApp');
    app.factory('httpFactory', [
        '$http',
        '$log',
        'resultService', 
        'scoreService', 
        function($http, $log, resultService, scoreService){

        /*Speed Call Function*/
        var Speed = function($var)
        {
            $log.debug('Http checkSpeed',$var);
            var obj = config($var);
            
            $http.get(obj.speed)
                //success
                .then(function success(data){
                    
                    $log.debug('http speed success', data)
                    var responseData = data.data;
                    var score = scoreService.getScore(responseData.test.score);

                    var mgs = [];
                    var messages = responseData.messages;
                    
                    angular.forEach(messages, function(key){

                    if(key.ruleImpact != 0)
                    {
                        var m = {
                            title:key.localizedRuleName,
                            impact:key.ruleImpact
                        }
                        mgs.push(m);
                    }

                    });

                    var group = {
                        title:'Speed',
                        time:responseData.total_time,
                        status:score.icon,
                        icon:'dashboard',
                        label:score.flag,
                        sign:score.sign,
                        score:responseData.test.score,
                        alerts:mgs.length,
                        messages:mgs,
                    };

                resultService.addResults(group);
                $log.debug('speed group', group)
            },
                //error
                function error(err){
                   $log.debug('http speed error', err)
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

                var mgs = [];
                var messages = responseData.messages;
                angular.forEach(messages, function(key){
                    if(key.ruleImpact != 0)
                    {
                        var m = {
                            title:key.localizedRuleName,
                            impact:key.ruleImpact
                        }
                        mgs.push(m);
                    }

                });



                var group = {
                        title:'Mobile',
                        status:score.icon,
                        icon:'mobile',
                        label:score.flag,
                        sign:score.sign,
                        score:responseData.test.score,
                        alerts:mgs.length,
                        messages:mgs,
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

                var alerts = responseData.messages.length;
                var dataScore = (100 - alerts);
                var score = scoreService.getScore(dataScore);


                var mgs = [];
                var messages = responseData.messages;
                angular.forEach(messages, function(key){
                    var m = {
                            title:key.message,
                            impact:key.type
                            };
                        mgs.push(m);    
                });

                var group = {
                        title:'Markup',
                        status:score.icon,
                        icon:'code',
                        label:score.flag,
                        sign:score.sign,
                        score:dataScore,
                        alerts:mgs.length,
                        messages:mgs,
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


    }]);
    
}());
