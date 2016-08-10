'use strict';

var app = angular.module('analysisApp');

app.service('resultService',function($rootScope, alertService){
    
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
    
    
    
});
