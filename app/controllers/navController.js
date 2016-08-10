'use strict';

var app = angular.module('analysisApp');

app.controller('navController', function($scope,$http, httpFactory, resultService){
    
    
    $scope.input = {
        status:true,
        placeholder:'http://yoursite.com',
    }
    
    $scope.load = function($var)
    {
        $scope.input.status = false;
        var userInput = resultService.addSite($var);
        var speedTest = httpFactory.Speed($var);
        var mobileTest = httpFactory.Mobile($var);
        var markupTest = httpFactory.Markup($var);
            
    }

    $scope.clearR = function()
    {
        $scope.input.status = true;
        $scope.url='';
        $scope.input.placeholder = 'http://yoursite.com';
        resultService.clearResults(); 
        console.log("Results Cleared");
    }
    
    
    
    //$scope.load('http://localhost/www/cdn/');
    
});