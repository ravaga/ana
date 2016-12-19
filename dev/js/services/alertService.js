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
