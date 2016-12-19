(function(){
    
    'use strict';
    
    var app = angular.module('analysisApp');

    app.factory('iframeFactory', [
        'resultService', 
        '$sce', 
        function(resultService, $sce){

        var iframes = [];

        var getIframes = function()
        {
             iframes = [
                    iframe(375,667, "iPhone"), 
                    iframe(667,375, "iPhone")
                ];
            console.log(iframes);
            return iframes;
        }

        var clearIframes = function(){
            iframes = [];
        }



        /*iframe Generator*/
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


    return{
        getIframes: getIframes,
        clearIframes: clearIframes
    }

    }]);
    
}());
