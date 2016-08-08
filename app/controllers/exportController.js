'use strict';

var app = angular.module('analysisApp');

app.controller('exportController', function(resultService,$scope, $filter, $http){
        

    $scope.savePDF = function($foo)
    {
        var toPDF = exportPDF($foo);
    };
        
    
    var push = function(trg , obj)
    {
        trg.push(obj);
        return true;
    }
    
    
    var exportPDF = function($foo) {
        
        if($foo == null )
            return false;
        
        var site = resultService.getSite();     
        
        var date = $filter('date')(new Date(), "MMM d, y h:mm:ss a");
        var datefilter = $filter('date')(date, "MMMdyhmmssa");
        
        var finalDoc = {header:false, footer:false, content:false};
        
        var docDefinition = {
            content: [],
            styles: {
                logo:{
                  alignment:'center'  
                },
                title: {
                    fontSize: 15,
                    margin: [0, 15, 0, 5],
                    alignment: 'center'
                    },
                subtitle:{
                    fontSize: 12,
                    margin:[0,15,0,5],
                    alignment: 'center'
                    },
                paragraph:{
                    fontSize: 9,
                    color:'black',
                    margin:[0,15,0,15],
                    alignment:'justify'
                },
                column:{
                    fontSize: 14,
                    color:'#222',
                    alignment:'center'
                    },
                footer:{
                    margin: [0,300,0,0],
                    alignment:'center'
                },
                success:{
                    color:'#5cb85c'
                    },
                danger:{
                    color:'#FF0000'
                    },
                warning:{
                    color:'#f0ad4e'
                    }
                }
            };
        //get logo
        var columnDefinition1 = { style:'column',columns:[]};  
        var columnDefinition2 = { style:'column',columns:[]};   

        var target = docDefinition.content;
        //pdfTitle
        var docHeader = function($foo, site, date)
        {
            var pdfHeader = [
                {
                style: 'title',
                text: site
                },
                {
                style:'subtitle',
                text: site+ "\n"+ "Web Analysis | "+ date
                },
                {
                style: 'paragraph',
                text: $foo
                }
            ];
        
            var headerPush = push(target, pdfHeader);
            finalDoc.header = true;
        }
        docHeader($foo, site, date);
    
        var docFooter = function()
        {
            
            var done = $http.get('src/pdfImages.php').success(function(response){
                var pdfLogo = response.pdfLogo;
                var pdfFooter = response.pdfFooter;
                var pdfCTA = response.pdfCTA;
                
                var pdfFooter = [
                    { 
                        style:'footer',
                        columns:[
                            {
                                width:200,
                                text:"Praesent nisl est, pellentesque quis leo ac, imperdiet rhoncus arcu. Vestibulum iaculis maximus elementum. Interdum et malesuada fames ac ante ipsum primis in faucibus. Pellentesque elementum arcu in luctus pharetra.",
                                fontSize:10
                            },
                            {
                                image:'data:image/png;base64,'+pdfCTA,
                                pageBreak:'after'
                            }
                        ]
                    },
                    {
                        image:'data:image/png;base64,'+pdfFooter,
                        width: 500,
                    },
                    {
                        text: 'Contact Info | Contact Info | 000-000-0000 | Talk to Sean Ansari and step it up to the next level!'
                    }
                ];
                docDefinition.content.push(pdfFooter);
                return true;              
            });
            
            if(done)
            {
                finalDoc.footer = true;
            }
            
        }
        
        //create 1st row with columns
        var docContent = function()
        {
            var results = resultService.getResults();
            angular.forEach(results, function(obj, key){
                var data = Object.keys(obj);
                var x = data[0];
                var lolo = {text: 'Your site '+ obj[x].title};
                columnDefinition1.columns.push(lolo);
                if(columnDefinition1.columns.length == results.length)
                {
                    docDefinition.content.push(columnDefinition1);
                }
            });
        
            angular.forEach(results, function(obj, key){
                var data = Object.keys(obj);
                var x = data[0];
                var lolo = {style:obj[x].label,text:obj[x].sign};
                columnDefinition2.columns.push(lolo);
                if(columnDefinition2.columns.length == results.length)
                {
                    docDefinition.content.push(columnDefinition2);
                }
            });
            finalDoc.content = true;
        }
        docContent();
        
        
        docFooter();
        if(finalDoc.header == true && finalDoc.footer == true && finalDoc.content == true) 
        {
            console.log(finalDoc);
            console.log(docDefinition);
            //generate logo and print pdf
            html2canvas(document.getElementById('logo'), {
                onrendered: function (canvas) {
                    var data = canvas.toDataURL();
                    //Add logo
                    var logo = {
                            style:'logo',
                            image: data,
                            width:350,
                        };
                    //push to front
                    docDefinition.content.splice(0,0,logo);
                    //create PDF
                    
                    pdfMake.createPdf(docDefinition).
                    download("VividSoftWareSolution_report_"+site+"_"+datefilter+".pdf");
                
                }
            });
        }
    }
        
        
        
    
});