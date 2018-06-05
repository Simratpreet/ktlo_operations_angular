app.controller('ismCtrl', function($scope, $http) {
            

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
                    url: 'http://10.204.43.206:5012/ism_tickets'
                    
                }).then(function successCallback(responsejson) {
                    /*$scope.data_json = responsejson.data.load_logs_data;
                    $scope.tabledata = responsejson.data.detail_data;*/
                    $scope.data_received = responsejson.data;
                    $scope.inc = $scope.data_received.incidents;
                    $scope.sr = $scope.data_received.service_request;
                    $scope.cr = $scope.data_received.change_request;
                    //console.log("responsejson.data : " + JSON.stringify($scope.data_received));

                    c3chart();
                    detaildata();

                }, function errorCallback(responseValue) {
                    console.log("error");
                });

                console.log("Finished generating chart...");
            }

            var c3chart = function() {
            console.log("Inside c3chart...");
            

            var chart = c3.generate({
                bindto: '#chart',
                data: {
                    // iris data from R
                    columns: [
                        ['INC', $scope.inc],
                        ['SR', $scope.sr],
                        ['CR', $scope.cr]
                    ],
                    type : 'pie',
                    onclick: function (d, i) { console.log("onclick", d, i); },
                    onmouseover: function (d, i) { console.log("onmouseover", d, i); },
                    onmouseout: function (d, i) { console.log("onmouseout", d, i); }
                }
            });

            
        }

        var detaildata = function() {
                $scope.global = true;
                var request = {
                limit: 10,
                page: 1,
                order: [
                  {field:"id", sorting:"ASC"},
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
                columns: [
                  {
                    field: "id", // used as identifier for sorting or filtering. creates CSS class "column-{{field}}"
                    name: "id", // creates CSS class "column-{{name}}"
                    title: "Number", // column title
                    placeholder: "Filter by Number", // placeholder for filter input
                    sortable:true,
                    filterable:true
                },
                  {
                    field:"name",
                    title:"Short Description"
                                        
                  },
                  {field:"priority", title:"Priority", sortable:true},
                  {field:"state", title:"State", sortable:true},
                  {field:"opened", title:"Opened", sortable:true},
                  {field:"due_date", title:"Due Date", sortable:true},
                  {field:"closed", title:"Closed", sortable:true}
                ],
                provider: dataProvider,
                request: request,

                scrollable: {
                  maxHeight: "400px"
                },
                multisorting: false,
                limits: [10, 25, 50, 100],
                theme: null,
                debug:true
                };

                

                $scope.myFn = function ($row) {
                alert ("$scope.myFn($row):\n" + JSON.stringify($row, null, "    "));
                };

                
                
                no_records = $scope.data_received.ticket_details.length;
                tickets = $scope.data_received.ticket_details;
                var ism_db = [];
                for (var i = 0; i < no_records; i++) {
                    var number = tickets[i].number;
                    console.log(number);
                    var sd = tickets[i].short_description;
                    var priority = tickets[i].priority;
                    var state = tickets[i].state;
                    var opened = tickets[i].opened;
                    var due_date = tickets[i].due_date;
                    var closed = tickets[i].closed;
                    
                    ism_db.push({
                        "id": number,
                        "name": sd,
                        "priority": priority,
                        "state": state,
                        "opened": opened,
                        "due_date": due_date,
                        "closed": closed
                    })
                }
                

                function dataProvider (request, callback) {
                console.log("##REQUEST", request);
                var data = ism_db.slice(0);
                if (request.order.length && request.order[0] && request.order[0].field == "id") {
                  data.sort(function(a, b) {
                    return request.order[0].sorting == "ASC" ? a.id - b.id
                         : request.order[0].sorting == "DESC" ? b.id - a.id
                         : 0;
                  });
                }
                else if (request.order.length && request.order[0] && ["name", "email"].indexOf(request.order[0].field) >= 0) {
                  data.sort(function(a, b) {
                    var A = (request.order[0].sorting == "ASC" ? a[request.order[0].field] : b[request.order[0].field]).toLowerCase();
                    var B = (request.order[0].sorting == "ASC" ? b[request.order[0].field] : a[request.order[0].field]).toLowerCase();
                    return A < B ? -1
                         : A > B ? 1
                         : 0
                    ;
                  });
                }
                if (request.like.name) {
                  data = data.filter(function(o){
                    return o.name && o.name.toLowerCase().indexOf(request.like.name.toLowerCase()) > -1;
                  });
                }
                if (request.like.email) {
                  data = data.filter(function(o){
                    return o.email && o.email.toLowerCase().indexOf(request.like.email.toLowerCase()) > -1;
                  });
                }
                var amount = data.length;
                var limit = request.limit > 0 ? request.limit : 10;
                var page = request.page > 0 &&  request.page*limit-limit <= amount ? request.page : 1;
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

                
            }



            
            onload();

            });