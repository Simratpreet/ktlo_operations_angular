var app = angular.module('ktloApp',["ui.router"]);


app.config(function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise('/home');
    $stateProvider.state("home", {
    	url:"/home",
        templateUrl : "views/home/home.html"
    });
});