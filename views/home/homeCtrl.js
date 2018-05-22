
app.controller('homeCtrl' ,['$scope', '$http', '$location', function($scope,$http,$location){
	$scope.test="Chirag";

	$scope.loadFirstMetricPage=function()
	{
		//console.log("Cell 1 click");
		$location.path("/load_logs");
	}

	$scope.test_api=function()
	{
		console.log("Cell 2 click");
		$location.path("/test_api");
	}
}]);

