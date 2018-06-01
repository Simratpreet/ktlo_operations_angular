app.controller('load_logs_ctrl', function($scope, $http) {
            $scope.db = [];

            var dateToday = new Date();

            $scope.date_range = "23 Mar 2018";
            $scope.start_date = -1;
            $scope.end_date = -1;


            var get_data = {};
            get_data.start_date = $scope.start_date;
            get_data.end_date = $scope.end_date;

            //Calculate yesterday's date
            var dateYesterday = new Date();
            dateYesterday.setDate(dateToday.getDate() - 1);

            var start_date = new Date();
            start_date.setDate(dateToday.getDate() - 31);

            $('input[name="daterange"]').daterangepicker({
                opens: 'left',
                minDate: new Date('2018-03-23'),
                maxDate: dateYesterday,
                startDate: start_date,
                endDate: dateYesterday

                //maxDate : 
            }, function(start, end, label) {
                console.log("A new date selection was made: " + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
                $scope.global = false;
                $scope.start_date = start.format('YYYY-MM-DD');
                $scope.end_date = end.format('YYYY-MM-DD');
                get_data.start_date = $scope.start_date;
                get_data.end_date = $scope.end_date;
                onload();
            })



            var onload = function() {
                console.log("Inside onload function...");
                console.log("get_data : " + JSON.stringify(get_data));
                $http({
                    method: 'GET',
                    url: 'http://10.204.43.206:5012/loadtracker',
                    params: get_data
                }).then(function successCallback(responsejson) {
                    $scope.data_json = responsejson.data.load_logs_data;
                    $scope.tabledata = responsejson.data.detail_data;
                    //console.log("responsejson.data : " + JSON.stringify(responsejson.data));

                    c3chart();
                    detaildata();

                }, function errorCallback(responseValue) {
                    console.log("error");
                });
                console.log("Finished generating chart...");
            }

            var detaildata = function() {
                $scope.global = true;
                tableJson = $scope.tabledata;
                var request = {
                    limit: 10,
                    page: 1,
                    order: [
                        { field: "id", sorting: "ASC" },
                        //{field:"name", sorting:"DESC"},
                    ],
                    like: {
                        "name": "",
                    }
                };

                $scope.tableviewOptions = {
                    template: {
                        "head.cell": null,
                        "body.cell": null,
                        "body.cell.edit": null,
                        "foot": null,
                        "pager": null,
                        "pager.limit": null,
                        "pager.selection": null,
                        "pager.controls": null,
                    },
                    columns: [{
                            field: "id", // used as identifier for sorting or filtering. creates CSS class "column-{{field}}"
                            name: "id", // creates CSS class "column-{{name}}"
                            title: "Date", // column title
                            placeholder: "Filter by Date", // placeholder for filter input
                            sortable: true,
                            filterable: true

                        },
                        {
                            field: "name",
                            title: "Status",
                            sortable: true,
                            filterable: true,
                            placeholder: "Filter by Status"
                        },
                        { field: "sdate", title: "Start Time", sortable: true },
                        { field: "edate", title: "End Time", sortable: true },
                        { field: "duration", title: "Duration (in mins)", sortable: true }
                    ],
                    provider: dataProvider,
                    request: request,

                    scrollable: {
                        maxHeight: "400px"
                    },
                    multisorting: false,
                    limits: [10, 25, 50, 100],
                    theme: null,
                    debug: true
                };




                $scope.myFn = function($row) {
                    alert("$scope.myFn($row):\n" + JSON.stringify($row, null, "    "));
                };

                var dataLength = tableJson.length;
                var db = [];
                for (var i = 0; i < dataLength; i++) {
                    var date = tableJson[i].date;
                    var status = tableJson[i].status;
                    var sdate = tableJson[i].start_ts;
                    var edate = tableJson[i].end_ts;
                    var duration = tableJson[i].duration;
                    //console.log("Name : " + name);
                    //console.log("date : " + date);
                    db.push({
                        "id": date,
                        "name": status,
                        "sdate": sdate,
                        "edate": edate,
                        "duration": duration
                    })
                }
                //  console.log("DB: "+db);

                function dataProvider(request, callback) {
                    //    console.log("##REQUEST", request);
                    var data = db.slice(0);
                    if (request.order.length && request.order[0] && request.order[0].field == "id") {
                        data.sort(function(a, b) {
                            return request.order[0].sorting == "ASC" ? Date.parse(a.id) - Date.parse(b.id) :
                                request.order[0].sorting == "DESC" ? Date.parse(b.id) - Date.parse(a.id) :
                                0;
                        });
                    } else if (request.order.length && request.order[0] && ["name"].indexOf(request.order[0].field) >= 0) {
                        data.sort(function(a, b) {
                            var A = (request.order[0].sorting == "ASC" ? a[request.order[0].field] : b[request.order[0].field]).toLowerCase();
                            var B = (request.order[0].sorting == "ASC" ? b[request.order[0].field] : a[request.order[0].field]).toLowerCase();
                            return A < B ? -1 :
                                A > B ? 1 :
                                0;
                        });
                    } else if (request.order.length && request.order[0] && request.order[0].field == "duration") {
                        data.sort(function(a, b) {
                            return request.order[0].sorting == "ASC" ? a.duration - b.duration :
                                request.order[0].sorting == "DESC" ? b.duration - a.duration :
                                0;
                        });
                    } else if (request.order.length && request.order[0] && request.order[0].field == "sdate") {
                        data.sort(function(a, b) {
                            return request.order[0].sorting == "ASC" ? Date.parse(a.sdate) - Date.parse(b.sdate) :
                                request.order[0].sorting == "DESC" ? Date.parse(b.sdate) - Date.parse(a.sdate) :
                                0;
                        });
                    } else if (request.order.length && request.order[0] && request.order[0].field == "edate") {
                        data.sort(function(a, b) {
                            return request.order[0].sorting == "ASC" ? Date.parse(a.edate) - Date.parse(b.edate) :
                                request.order[0].sorting == "DESC" ? Date.parse(b.edate) - Date.parse(a.edate) :
                                0;
                        });
                    }
                    if (request.like.name) {
                        data = data.filter(function(o) {
                            return o.name && o.name.toLowerCase().indexOf(request.like.name.toLowerCase()) > -1;
                        });
                    }

                    if (request.like.id) {
                        data = data.filter(function(o) {
                            return o.id && o.id.toLowerCase().indexOf(request.like.id.toLowerCase()) > -1;
                        });
                    }

                    var amount = data.length;
                    var limit = request.limit > 0 ? request.limit : 10;
                    var page = request.page > 0 && request.page * limit - limit <= amount ? request.page : 1;
                    var begin = page * limit - limit;
                    var end = begin + limit;
                    var rows = data.slice(begin, end);
                    var response = {
                        page: page,
                        limit: limit,
                        amount: amount,
                        rows: rows
                    };
                    callback(response);
                }

                //console.log("Exiting table details....");
            }

            //console.log("tableJson2 : " + tableJson);
            var c3chart = function() {

                sampleJson = $scope.data_json;
                
                var arrayLength = sampleJson.length;
                console.log("arrayLength : " + arrayLength);

                var dates = new Array();
                dates.push('x');
                var success_times = new Array();
                success_times.push('data1');
                var failure_times = new Array();
                failure_times.push('data2');

                for (i = 0; i < arrayLength; i++) {
                    var load_date = sampleJson[i].date;

                    var success_time = sampleJson[i].SUCCESS;
                    var failure_time = sampleJson[i].FAILED;


                    //console.log("success_time : "+success_time);
                    //console.log("failure_time : "+failure_time);

                    dates.push(load_date);
                    success_times.push(success_time)
                    failure_times.push(failure_time);

                }

                var chart = c3.generate({
                        size: {

                            height: 450
                        },
                        data: {
                            x: 'x',
                            xFormat: '%e-%b-%Y', 

                            columns: [dates, success_times, failure_times],

                            colors: {
                                data1: '#a0ca98',
                                data2: 'rgba(243, 49, 85, 0.86)'
                            },

                            names: {
                                data1: "Success",
                                data2: "Failed",
                            },

                            types: {
                                data1: 'bar',
                                data2: 'bar',
                            },

                            groups: [
                                ['data1', 'data2']
                            ]
                        },
                        tooltip: {
                           
                                format: {
                                     
                                    value: function(value, ratio, id) {
                                        
                                        return value + " mins";
                                    }
                                    
                                }
                        },
                        legend: {
                            show: true,
                            position: 'inset'
                           
                        },

                        grid: {
                            x: {
                                show: false
                            },
                            y: {
                                show: true
                            }
                        },

                        axis: {
                            x: {
                                type: 'timeseries',
                                tick: {
                                    format: "%e-%b-%Y",
                                    culling: false,
                                    rotate: -60


                                },
                                label: {
                                    text: 'Load Date',
                                    position: 'outer-center'
                                },
                                height: 110
                            },
                            y: {
                                label: {
                                    text: 'Duration (in mins)',
                                    position: 'outer-middle'

                                }
                            }
                        }
                    });


                    setTimeout(function() {
                        chart.groups([
                            ['data1', 'data2']
                        ])
                    }, 3000);
                }

                onload();

            });