'use strict';

var app = angular.module('analysisApp');

app.service('resultService',function($rootScope){
    
    var resultsList = [];
    var screenshot = [];
    var testSite = '';
    
    var addResults = function(obj){
        resultsList.push(obj);
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
        testSite = '';
        screenshot = [];
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
    
    
    
});
