app.controller('load_logs_ctrl', function($scope, $http){
    $scope.date_range="23 Mar 18";
    $scope.start_date = -1;
    $scope.end_date = -1;

    var get_data = {};
    get_data.start_date = $scope.start_date;
    get_data.end_date = $scope.end_date;

    //Calculate yesterday's date
    var dateToday = new Date();
    //dateYesterday.setDate(dateToday.getDate() - 1);

    $('input[name="daterange"]').daterangepicker({
        opens : 'left',
        minDate : new Date('2018-03-23'),
        maxDate : dateToday

        //maxDate : 
    }, function(start, end, label) {
        console.log("A new date selection was made: " + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
        $scope.start_date = start.format('YYYY-MM-DD');
        $scope.end_date = end.format('YYYY-MM-DD');
        get_data.start_date = $scope.start_date;
        get_data.end_date = $scope.end_date;
        onload();
    });



    var onload = function(){
        console.log("Inside onload function...");
        console.log("get_data : " + JSON.stringify(get_data));
        $http({
                method : 'GET',
                url : 'http://10.204.43.206:5010/loadtracker',
                params : get_data
        }).then(function successCallback(responsejson) {
                $scope.data_json = responsejson.data.load_logs_data;
                $scope.sd = responsejson.data.sd;
                console.log("responsejson.data : " + JSON.stringify(responsejson.data));
                c3chart();
            }, function errorCallback(responseValue) {
                console.log("error");
        }); 
        console.log("Finished generating chart...");
    }

var c3chart=function(){
    
    sampleJson = $scope.data_json;
    //console.log("sampleJson : " + sampleJson);
    //console.log(typeof(sampleJson));
    var arrayLength = sampleJson.length;
    console.log("arrayLength : "+ arrayLength);

    var dates = new Array();
    dates.push('x');
    var success_times=new Array();
    success_times.push('data1');
    var failure_times=new Array();
    failure_times.push('data2');

    for(i=0;i<arrayLength;i++)
    {
        var load_date = sampleJson[i].date;
        console.log("Date : "+ load_date);
        
        //var logs= sampleJson[i].logs;
        

        /*var success_time=JSON.stringify(logs[0].success);
        var failure_time=JSON.stringify(logs[1].fail);*/

        /*var success_time=logs[0].success;
        var failure_time=logs[1].fail; */

        var success_time=sampleJson[i].SUCCESS;
        var failure_time=sampleJson[i].FAILED;       

        
        console.log("success_time : "+success_time);
        console.log("failure_time : "+failure_time);

        dates.push(load_date);
        success_times.push(success_time)
        failure_times.push(failure_time);

    }

    var chart = c3.generate({
            data: {
            x: 'x',
            xFormat: '%Y-%m-%d', 

            columns: [dates, success_times, failure_times],

            //onclick: function(e) { alert(e.value); },

            colors: {
                data1: '#66ff66',
                data2: '#ff6666',
            },

            names: {
                data1: "Success",
                data2: "Failure",
            },

            types: {
                data1: 'bar',
                data2: 'bar',
            },

            groups: [
                ['data1', 'data2']
                ]
            },

            legend: {
                show: true,

                position : 'right'
            },

            grid: {
                x: {
                    show: true
                },
                y: {
                    show: true
                }
            },
            
            axis: {
                x: {
                    type: 'timeseries',
                    tick: {
                    format: "%e %b %Y"
                    //format: '%Y-%m-%d'
                    },
                    label : {
                            text : 'Load Date',
                            position: 'outer-center'
                    }
                },
                y : {
                    label : {
                            text : 'Duration (In Minutes)',
                            position : 'outer-middle'
                    }
                }
            }
        });
        
        /*setTimeout(function () {
            chart.load({
                columns: [
                    ['data4', 1200, 1300, 1450, 1600, 1520, 1820],
                ]
            });
        }, 1000);

        setTimeout(function () {
            chart.load({
                columns: [
                    ['data5', 200, 300, 450, 600, 520, 820],
                ]
            });
        }, 2000);

        setTimeout(function () {
            chart.groups([['data1', 'data2', 'data3', 'data4', 'data5']])
        }, 3000);*/

        setTimeout(function () {
            chart.groups([['data1', 'data2']])
        }, 3000);
    }

    onload();
});

