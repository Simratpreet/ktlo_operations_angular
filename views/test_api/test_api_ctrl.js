app.controller('test_api_ctrl',['$scope','$http', function($scope, $http){
	console.log("Inside test_api_ctrl");
	/*
	$http({
            method: 'GET',
            url: 'http://10.204.43.206:5010/loadtracker'
        }).then(function successCallback(responsejson) {
            $scope.data_json = responsejson.data.load_logs_data;
            //console.log("Response is : " + $scope.data_json);
            var test = JSON.stringify($scope.data_json[0]);
            console.log("test : "+test);
        }, function errorCallback(responseValue) {
            console.log("error");
        });
        */

    var sampleJson=[
		{
			"date" : "01-May-2018",
			"logs" : [{"success":30},{"fail":40}]
		},

		{
			"date" : "02-May-2018",
			"logs" : [{"success":40},{"fail":20}]
		},

		{
			"date" : "03-May-2018",
			"logs" : [{"success":60},{"fail":20}]
		},

		{
			"date" : "04-May-2018",
			"logs" : [{"success":80},{"fail":15}]
		},

		{
			"date" : "05-May-2018",
			"logs" : [{"success":50},{"fail":0}]
		}
	];

	var arrayLength=sampleJson.length;
	console.log("arrayLength : "+arrayLength);

	var dates=new Array();
	dates[0]='x';
	var success_times=new Array();
	success_times[0]='data1';
	var failure_times=new Array();
	failure_times[0]='data2';

	for(i=0;i<arrayLength;i++)
	{
		var date= JSON.stringify(sampleJson[i].date);
		console.log("Date : "+date);
		
		var logs= sampleJson[i].logs;
		

		var success_time=JSON.stringify(logs[0].success);
		var failure_time=JSON.stringify(logs[1].fail);

		
		console.log("success_time : "+success_time);
		console.log("failure_time : "+failure_time);

		dates[i+1]=date;
		success_times[i+1]=success_time;
		failure_times[i+1]=failure_time;

	}

	console.log("dates - " + dates); 
	console.log("success_times -" + success_times);
	console.log("failure_times -" + failure_times);
}]);