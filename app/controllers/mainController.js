'use strict';

var app = angular.module("analysisApp");
app.controller("mainController", function($scope, $filter, $uibModal, $anchorScroll, $location, CallFactory, resultService){
    
    $scope.date = $filter('date')(new Date(), "MMM d, y h:mm:ss a")
    
    //go to mobile views
    $scope.toMobileView = function(){
        $location.hash('mobile');
        $anchorScroll();
    }
    
    
    $scope.site = resultService.getSite();
    //scope results
    $scope.results = resultService.getResults();
    
    $scope.screenshot = resultService.getScreenshot();
    
    $scope.$on('results:cleared', function(){
        console.log('Cleared');
        $scope.results = resultService.getResults();
        $scope.screenshot = resultService.getScreenshot();
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
    
    //clear search
    $scope.clear = function()
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
    
    /*Main config file*/
    /*var srcApi = function($var)
    {
        var debugMode = false; 
                
        if(debugMode == false)
        {
            var siteTest = {
                    "speed": 'src/speed.php?url='+$var,
                    "mobile": 'src/mobile.php?url='+$var,
                    "HTMLmarkup":'src/w3valid.php?url='+$var,
                    };  
            }
            else
            {
                var siteTest = {
                        "speed": 'dev/static/speed.json',
                        "mobile": 'dev/static/mobile.json',
                        "HTMLmarkup":'dev/static/w3.json',
                    };
            }
    return siteTest;
    }
    
    
    /* DEBUGGING TOOL*/
    $scope.debugPannel = false;
    if($scope.debugPannel == true)
    {$scope.load("http://consorciocdn.com");}
    
    $scope.debugger = function(){
        if($scope.debug == true)
        {$scope.debug = false;}
        else
        {$scope.debug = true}
    }
  
});