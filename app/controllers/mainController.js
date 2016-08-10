'use strict';

var app = angular.module("analysisApp");
app.controller("mainController", function($scope, $filter, $uibModal, $anchorScroll, $location, resultService, alertService, iframeFactory){
    
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
  
});