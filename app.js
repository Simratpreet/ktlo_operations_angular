var app = angular.module('ktloApp', ["ui.router", "tableview"]);


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
    .state("test_api", {
    	url : "/test_api",
        templateUrl : "views/test_api/test_api.html",
        controller : "test_api_ctrl"
    });
});