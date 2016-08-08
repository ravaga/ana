'use strict';

var app = angular.module("analysisApp");
app.controller("lookUpController", function($scope, $http, resultService,  $filter, $sce, $uibModal, $anchorScroll, $location){
    
    $scope.form = true;   
    $scope.screenshot= '';
    $scope.date = $filter('date')(new Date(), "MMM d, y h:mm:ss a")
    
    $scope.gotoIframes = function(){
        $location.hash('iframeSection');
        $anchorScroll();
    }
    
    
    /* Load Function*/
    $scope.load = function ($var) { 
        if($var == undefined)
        {
            console.log("Yes indeed");
            return false;
        }
        else
        {
            $scope.form = false;
            

            var site = resultService.addSite($var);        
           
            $scope.iframes = [
                iframe(375,667, "iPhone"), 
                iframe(667,375, "iPhone")
            ];
            
            $scope.gotoIframes();
            /* HTTP CALLS 
            var siteTest = {
                "speed": 'src/speed.php?url='+$var,
                "mobile": 'src/mobile.php?url='+$var,
                "HTMLmarkup":'src/w3valid.php?url='+$var,
            };
        
            
            /* LOCAL FILES  */
            var siteTest = {
                "speed": 'dev/static/speed.json',
                "mobile": 'dev/static/mobile.json',
                "HTMLmarkup":'dev/static/w3.json',
            };
            /* END LOCAL*/
            var testKeys = Object.keys(siteTest);
            var testLength = testKeys.length;
            var testScore = 0;
            var testMessages = 0;
            
            $scope.site = resultService.getSite();
            
            angular.forEach(siteTest, function(value, key){
                $http.get(value).success(function(data){
                    var obj = {};
                    var bar = "";
                    var icon = "";
                    var title = "";
                    var score = 0;
                    var sign = '';
                    var alerts = 0;
                    var messages= {};
                       
                        //set score
                        if(key == "HTMLmarkup")
                        {
                            score = (100 - data.messages.length);
                            title = "Markup";
                            alerts = data.messages.length;
                            messages = data.messages[0];
                        }
                        else
                        {
                            messages = data.messages;
                            if(key == "mobile")
                            {
                                title = "Mobile";
                               
                                var imgData = data.screenshot.data;
                                
                                var cleanThis = function(data){
                                    data = data.replace(/_/g,'/');
                                    data = data.replace(/-/g, '+');
                                    return data;
                                }
                                 $scope.imageView = cleanThis(imgData);
                                $scope.screenshot = data.screenshot.data;
                            }
                            
                            else if(key == "speed")
                            {title = "Speed";}
                            
                            score = data.test.score;
                            alerts = data.alerts;
                        }
                    
                    //set bar flags
                    if(score < 33)
                    {
                        bar = "danger";
                        icon = 'thumbs-down';
                        sign = 'Bad';
                    }
                    else if(score >= 34 && score <= 66)
                    {
                        bar = "warning"; 
                        icon = 'thumbs-down';
                        sign = 'Not so good';
                    }
                    else if(score >= 67)
                    {
                        bar = "success";
                        icon = 'thumbs-up';
                        sign = 'Good';
                    }
                    
                    testScore = testScore + score;
                    testMessages = testMessages + alerts;
                    //group results
                    obj[key] = {
                    "title": title,
                    "icon": icon,
                    "label": bar,
                    "score": score,
                    "alerts": alerts,
                    "messages": messages,
                    "sign": sign
                    // to add Raw data add: "data":data
                    }; 
                    
                    //push into results
                    var addtoResults = resultService.addResults(obj);
                    var results = resultService.getResults();
                    
                    //check for final result
                    if(results.length == testLength)
                        {
                            var finalScore = testScore / testLength;
                            var label = '';
                            var message = '';
                            
                            if(finalScore < 65)
                            {
                                label = "danger"; 
                                message = 'Oops, looks like your website has several technical defects which are affecting your website performance '; 
                                icon = 'thumbs-down';
                            }
                            else if(finalScore >= 66 && finalScore <= 79)
                            {
                                label = "warning"; 
                                message='Looks like your site needs some optimization, call us to help you improve your site performance'; 
                                icon = 'thumbs-up';
                            }
                            else if(finalScore >= 80)
                            {
                                label = "success"; 
                                message = 'Congrats! this site is well optimized'; 
                                icon='thumbs-down';
                            }    
                            
                            
                            
                            $scope.alert = {
                                "title": "Test Results",
                                "score": testScore / testLength,
                                "label": label,
                                "messages": testMessages,
                                "message": message,
                                "icon": icon,
                                "sign": sign
                            };
                            $scope.results = resultService.getResults();
                            
                        }
                    
                });
            });
            
        }
        
    }

    $scope.export = function()
    {
        
        var modal = $uibModal.open({
            templateUrl:'export.html', 
            controller:'exportController',
            size: 'md'
        });

    }
    
    
    //clear search
    $scope.clearLookUp = function()
    {
        $scope.results = resultService.clearResults();
        $scope.imageView = '';
        $scope.form = true;
        $scope.alert = {};
        $scope.site = '';
        
    }
    
    /* Iframes */
    var iframe = function(w, h, title){
        var site = resultService.getSite();
        var url = $sce.trustAsResourceUrl(site);
        var cl = '';
        var view = '';
        if(w < h)
        {
            view = 'app/assets/imgs/iphone6_portrait@2.png';
            cl = 'Portrait';
        }
        else
        {
            view = 'app/assets/imgs/iphone6_landscape@2.png';
            cl = 'Landscape';
        }
                
        var g = {
            width:w,
            height:h,
            title:title,
            class:cl,
            view:view,
            url:url
            }
        return g; 
    }
    

    /* DEBUGGING TOOL*/
    $scope.debugPannel = true;
    if($scope.debugPannel == true)
    {$scope.load("http://vividsoftwaresolutions.com");}
    
    $scope.debugger = function(){
        if($scope.debug == true)
        {$scope.debug = false;}
        else
        {$scope.debug = true}
    }
  
});