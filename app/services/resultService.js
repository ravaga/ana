'use strict';

var app = angular.module('analysisApp');

app.service('resultService',function(){
    
    var resultsList = [];
    var testSite = '';
    
    var addResults = function(obj){
        resultsList.push(obj);
    };
    
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
        
    }
    
    return {
        addResults: addResults,
        getResults: getResults,
        addSite: addSite,
        getSite: getSite,
        clearResults:clearResults
    };
    
    
    
});
