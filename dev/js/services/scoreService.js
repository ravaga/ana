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
