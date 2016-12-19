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