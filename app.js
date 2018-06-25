var app = angular.module('ktloApp', ["ui.router", "tableview", "ui.calendar"]);


app.config(function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise('/load_logs');
    $stateProvider.state("home", {
    	url:"/home",
        templateUrl : "views/home/home.html",
        controller : "homeCtrl"
    })
    .state("load_logs", {
    	url : "/load_logs",
        templateUrl : "views/load_logs/load_logs.html",
        controller : "load_logs_ctrl"
    })
    .state("ism", {
        url : "/ism",
        templateUrl : "views/ism/ism.html",
        controller : "ismCtrl"
    })
    .state("outages", {
        url : "/outages",
        templateUrl : "views/outages/outages.html",
        controller : "outages_ctrl"
    })
    .state("test_api", {
    	url : "/test_api",
        templateUrl : "views/test_api/test_api.html",
        controller : "test_api_ctrl"
    });
});

app.directive('exportToCsv',function(){
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            console.log("exportToCsv called");
            var el = element[0];
            element.bind('click', function(e){
                //var table = e.target.nextElementSibling;
                var tables = document.getElementsByTagName('table');
                table = tables[0];
                var csvString = '';
                for(var i=0; i<table.rows.length;i++){
                    var rowData = table.rows[i].cells;
                    for(var j=0; j<rowData.length;j++){
                        row_data = (rowData[j].innerHTML).split('>');
                        row_data = (row_data[1]).split('<');
                        csvString = csvString + row_data[0] + ",";
                    }
                    csvString = csvString.substring(0,csvString.length - 1);
                    csvString = csvString + "\n";
                }
                csvString = csvString.substring(0, csvString.length - 1);
                var a = $('<a/>', {
                    style:'display:none',
                    href:'data:application/octet-stream;base64,'+btoa(csvString),
                    download:'LoadData.csv'
                }).appendTo('body')
                a[0].click()
                a.remove();
            });
        }
    }
});
