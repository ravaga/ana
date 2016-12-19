(function(){

    'use strict';
    
    var app = angular.module('analysisApp', [
        'ngRoute',
        'angular-loading-bar',
        'ui.bootstrap'
    ]);
    
    
    app.config([
        '$routeProvider',
        function($routeProvider){
            
            $routeProvider.
            when('/', {
            templateUrl: 'app/views/app.html',
            controller: 'mainController',
            });
            
        }]);
    
    
    
}());
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

(function(){
    
    'use strict';
    
    var app = angular.module('analysisApp');

    app.factory('iframeFactory', [
        'resultService', 
        '$sce', 
        function(resultService, $sce){

        var iframes = [];

        var getIframes = function()
        {
             iframes = [
                    iframe(375,667, "iPhone"), 
                    iframe(667,375, "iPhone")
                ];
            console.log(iframes);
            return iframes;
        }

        var clearIframes = function(){
            iframes = [];
        }



        /*iframe Generator*/
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


    return{
        getIframes: getIframes,
        clearIframes: clearIframes
    }

    }]);
    
}());

(function(){
    
    'use strict';
    
    var app = angular.module('analysisApp');
    
    app.controller('exportController', [
        'resultService', 
        '$scope',
        '$filter',
        '$http',
        function(resultService, $scope, $filter, $http){
         
            $scope.savePDF = function($foo)
            {
                var toPDF = exportPDF($foo);
            };
        
    
            var push = function(trg , obj)
            {
                trg.push(obj);
                return true;
            }
    
    
            var exportPDF = function($foo) {
        
                if($foo == null )
                    return false;
        
            var site = resultService.getSite();     
        
            var date = $filter('date')(new Date(), "MMM d, y h:mm:ss a");
            var datefilter = $filter('date')(date, "MMMdyhmmssa");
        
            var finalDoc = {header:false, footer:false, content:false};
        
            //doc definition
            var docDefinition = {
                content: [],
                styles: {
                    logo:{
                        alignment:'center'  
                    },
                    title: {
                        fontSize: 15,
                        margin: [0, 15, 0, 5],
                        alignment: 'center'
                    },
                    subtitle:{
                        fontSize: 12,
                        margin:[0,15,0,5],
                        alignment: 'center'
                    },
                    paragraph:{
                        fontSize: 9,
                        color:'black',
                        margin:[0,15,0,15],
                        alignment:'justify'
                    },
                    column:{
                        fontSize: 14,
                        color:'#222',
                        alignment:'center'
                    },
                    footer:{
                        margin: [0,300,0,0],
                        alignment:'center'
                    },
                    success:{
                        color:'#5cb85c'
                    },
                    danger:{
                        color:'#FF0000'
                    },
                    warning:{
                        color:'#f0ad4e'
                    }
                }
            };//end doc definition
        
            //get logo
            var columnDefinition1 = { style:'column',columns:[]};  
            var columnDefinition2 = { style:'column',columns:[]};   

            var target = docDefinition.content;
            //pdfTitle
            var docHeader = function($foo, site, date){
                
                var pdfHeader = [
                {style: 'title',text: site},
                {style:'subtitle',text: site+ "\n"+ "Web Analysis | "+ date},
                {style: 'paragraph',text: $foo}
                ];
        
                var headerPush = push(target, pdfHeader);
                finalDoc.header = true;
            }
            docHeader($foo, site, date);
    
            var docFooter = function(){
            
                var done = $http.get('src/pdfImages.php')
                .success(function(response){
                    var pdfLogo = response.pdfLogo;
                    var pdfFooter = response.pdfFooter;
                    var pdfCTA = response.pdfCTA;
                
                    var pdfFooter = [
                        { 
                            style:'footer',
                            columns:[
                        {
                            width:200,
                            text:"Praesent nisl est, pellentesque quis leo ac, imperdiet rhoncus arcu. Vestibulum iaculis maximus elementum. Interdum et malesuada fames ac ante ipsum primis in faucibus. Pellentesque elementum arcu in luctus pharetra.",
                            fontSize:10
                        },
                        {
                            image:'data:image/png;base64,'+pdfCTA,
                            pageBreak:'after'
                        }
                        ]},
                        {
                            image:'data:image/png;base64,'+pdfFooter,
                            width: 500,
                        },
                        {
                            text: 'Contact Info | Contact Info | 000-000-0000 | Talk to Sean Ansari and step it up to the next level!'
                        }
                    ];
                    docDefinition.content.push(pdfFooter);
                    return true;              
                });
            
                if(done)
                {
                    finalDoc.footer = true;
                }
            
            }
        
                //create 1st row with columns
                var docContent = function()
                {
                    var results = resultService.getResults();
                    angular.forEach(results, function(obj, key){
                        var data = Object.keys(obj);
                        var x = data[0];
                        var lolo = {text: 'Your site '+ obj[x].title};
                        columnDefinition1.columns.push(lolo);
                        if(columnDefinition1.columns.length == results.length)
                        {
                            docDefinition.content.push(columnDefinition1);
                        }
                    });

                    angular.forEach(results, function(obj, key){
                        var data = Object.keys(obj);
                        var x = data[0];
                        var lolo = {style:obj[x].label,text:obj[x].sign};
                        columnDefinition2.columns.push(lolo);
                        if(columnDefinition2.columns.length == results.length)
                        {
                            docDefinition.content.push(columnDefinition2);
                        }
                    });
                    finalDoc.content = true;
                }
                docContent();


                docFooter();
                if(finalDoc.header == true && finalDoc.footer == true && finalDoc.content == true) 
                {
                    console.log(finalDoc);
                    console.log(docDefinition);
                    //generate logo and print pdf
                    html2canvas(document.getElementById('logo'), {
                        onrendered: function (canvas) {
                            var data = canvas.toDataURL();
                            //Add logo
                            var logo = {
                                    style:'logo',
                                    image: data,
                                    width:350,
                                };
                            //push to front
                            docDefinition.content.splice(0,0,logo);
                            //create PDF

                            pdfMake.createPdf(docDefinition).
                            download("VividSoftWareSolution_report_"+site+"_"+datefilter+".pdf");

                        }
                    });
                }
            }
            
            
        }
    ])

    
    
}());
(function(){

    'use strict';
    
    var app = angular.module("analysisApp");
    app.controller('mainController', [
        '$scope', 
        '$filter', 
        '$uibModal', 
        '$anchorScroll', 
        '$location', 
        'resultService',
        'alertService', 
        'iframeFactory', 
        function($scope, $filter, $uibModal, $anchorScroll, $location, resultService, alertService, iframeFactory){

        $scope.date = $filter('date')(new Date(), "MMM d, y h:mm:ss a")
        $scope.resultView = false;
        //go to mobile views
        $scope.toMobileView = function(){
            $location.hash('mobile');
            $anchorScroll();
        }


        //Results Listener
        $scope.$on('results:updated', function(){

            //set results view
            $scope.resultView = true;
            $scope.site = resultService.getSite();
            $scope.results = resultService.getResults();
            $scope.screenshot = resultService.getScreenshot();
            $scope.alert = alertService.getAlert($scope.results);
            //generate iframes if we have results
            $scope.iframes = iframeFactory.getIframes();

        });


        //Results Cleared Listener
        $scope.$on('results:cleared', function(){
            $scope.iframes=[];
            $scope.resultView = false;
            $scope.results = resultService.getResults();
            $scope.screenshot = resultService.getScreenshot();
            $scope.site = resultService.getSite();
            $scope.alert = [];

        })


        //Export function
        $scope.export = function()
        {
            var modal = $uibModal.open({
                templateUrl:'export.html', 
                controller:'exportController',
                size: 'md'
            });
        }

        /* 
         * DEBUGGING PANEL
         */
        $scope.debugPannel = true;
        $scope.debugger = function(){
            if($scope.debug == true)
            {$scope.debug = false;}
            else
            {$scope.debug = true}
        }

    }]);
    
}());

(function(){
    
    'use strict';
    
    var app = angular.module('analysisApp');

    app.controller('navController', [
        '$scope', 
        '$http', 
        'httpFactory',
        'resultService', 
        function($scope,$http, httpFactory, resultService){


        $scope.input = {
            status:true,
            placeholder:'http://yoursite.com',
        }

        $scope.load = function($var)
        {
            console.log($var);
            if($var == null)
            {
                console.log('Yes Indeed');
                return false;
            }
            $scope.input.status = false;
            
            var userInput = resultService.addSite($var);
            
            var speedTest = httpFactory.Speed($var);
            //var mobileTest = httpFactory.Mobile($var);
            //var markupTest = httpFactory.Markup($var);

        }

        $scope.clearR = function()
        {
            $scope.input.status = true;
            $scope.url='';
            $scope.input.placeholder = 'http://yoursite.com';
            resultService.clearResults(); 
            console.log("Results Cleared");
        }


    }]);
    
}());
(function(){
    
    'use strict';
    
    var app = angular.module('analysisApp');

    app.service('alertService', [
        'scoreService', 
        function(scoreService){

    var alertBox = [];

    var getAlert = function($var){

        var score = 0;
        var length = $var.length;
        for(var i = 0; i < length; i++)
        {
            score += $var[i].score;
        }
        score = (score / length);
        var scoreObj = scoreService.getScore(score);

        var alert = {
            flag:scoreObj.flag,
            icon:scoreObj.icon,
            sign:scoreObj.sign,
            score:score
        };
        console.log(alert);
        return alert;
    };    

    var clearAlert = function(){
        alertBox = [];
    };

    return{
        getAlert:getAlert,
        clearAlert:clearAlert
    }

    }]);
    
    
}());

(function(){

    'use strict';
    var app = angular.module('analysisApp');

    app.service('resultService',[
        '$rootScope', 
        'alertService',
        function($rootScope, alertService){

        var limit = 3;
        var resultsList = [];
        var screenshot = [];
        var testSite = '';

        var addResults = function(obj){

            resultsList.push(obj)
            if(resultsList.length == limit)
            {
                $rootScope.$broadcast('results:updated');
            }

        };

        var addScreenshot = function(obj)
        {
            screenshot.push(obj);
        }

        var getScreenshot = function()
        {
            return screenshot;
        }

        var getResults = function(){
            return resultsList;
        };

        var addSite = function(site)
        {
            testSite = site;    
        }


        var getSite = function()
        {
            return testSite;
        }

        var clearResults = function()
        {
            resultsList = [];
            screenshot = [];
            alertService.clearAlert();
            testSite = '';
            $rootScope.$broadcast('results:cleared');

        }

        return {
            addResults: addResults,
            getResults: getResults,
            addScreenshot: addScreenshot,
            getScreenshot: getScreenshot,
            addSite: addSite,
            getSite: getSite,
            clearResults:clearResults
        };

    }]);
}());


(function(){

    'user strict';
    var app = angular.module('analysisApp');

    app.service('scoreService', [function(){

        var getScore = function(score){

            if(score < 33)
            {
                var group = 
                    {
                        flag : 'danger',
                        icon : 'thumbs-down',
                        sign : 'Bad',
                    }
            }
            else if(score >= 34 && score <= 66)
            {
                var group = 
                    {
                        flag : 'warning', 
                        icon : 'thumbs-down',
                        sign : 'Not so good',
                    }
            }
            else if(score >= 67)
            {
               var group = 
                   {
                       flag : 'success',
                        icon : 'thumbs-up',
                        sign : 'Good',
                   }
            }
            return group;
        }


       return {
           getScore:getScore
       } 

    }]);
    
}());
