app.controller('load_logs_ctrl',function($scope){

var onload=function(){
    console.log("Inside onload function...");
    c3chart();
    console.log("Finished generating chart...");
}

var c3chart=function(){
    var sampleJson=[
        {
            "date" : 2018-05-01,
            "logs" : [{"success":30},{"fail":40}]
        },

        {
            "date" : 2018-05-02,
            "logs" : [{"success":40},{"fail":20}]
        },

        {
            "date" : 2018-05-03,
            "logs" : [{"success":60},{"fail":20}]
        },

        {
            "date" : 2018-05-04,
            "logs" : [{"success":80},{"fail":15}]
        },

        {
            "date" : 2018-05-06,
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
    
    

        var chart = c3.generate({
        data: {
        x: 'x',
        //xFormat: '%Y-%m-%d', 
        /*columns: [
        ['x', '2013-01-01', '2013-01-02', '2013-01-03', '2013-01-04', '2013-01-05', '2013-01-06'],
        ['data1', 30, 200, 100, 400, 150, 250],
        ['data2', 130, 340, 200, 500, 250, 350]
        ],*/
        columns: [dates, success_times, failure_times],
        colors: {
        data1: '#F00',
        data2: '#000',
        },
        names: {
        data1: "test1",
        data2: "test2",
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
        show: false
        },
        axis: {
        x: {
        type: 'timeseries',
        tick: {
        format: "%e %b %y"
        //format: '%Y-%m-%d'
        },
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

