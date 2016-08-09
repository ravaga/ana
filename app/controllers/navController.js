'use strict';

var app = angular.module('analysisApp');

app.controller('navController', function($scope, CallFactory, resultService){
    
    
    $scope.load = function($var)
    {
        $scope.results = true;
        var speedTest = CallFactory.Speed($var);
        var mobileTest = CallFactory.Mobile($var);
        var markupTest = CallFactory.Markup($var);
            
    }
    
    $scope.clear = function()
    {
        $scope.results = false;
        resultService.clearResults(); 
        console.log(resultService.getResults());
    }
    
    
    
});