app.controller('ismCtrl', function($scope, $http) {
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
                c3chart();
                detaildata();   
                console.log("Finished generating chart...");
            }

            var c3chart = function() {
            console.log("Inside c3chart...");
            

            var chart = c3.generate({
                bindto: '#chart',
                data: {
                    // iris data from R
                    columns: [
                        ['INC', 30],
                        ['SR', 50],
                        ['CR', 20]
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
                    title: "Date", // column title
                    placeholder: "Filter by Date", // placeholder for filter input
                    sortable:true,
                    filterable:true,
                    template: {
                      "head.cell": null,
                      "body.cell": "Ctrl.body.cell.id",
                      "foot.cell": null,
                    },
                  },
                  {
                    field:"name",
                    title:"Status",
                    sortable:true,
                    filterable:true,
                    placeholder: "Filter by Status"
                  },
                  {field:"sdate", title:"Start Date", sortable:true},
                  {field:"edate", title:"End Date", sortable:true},
                  {field:"duration", title:"Duration", sortable:true}
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

                function fieldValidator (column, row, field, value) {
                var status = typeof value == "string" && value.trim().length;
                return {
                  message: status ? "" : "The field '" + column.title + "' can not be empty",
                  status: status
                };
                }

                function saveValidChangedField (column, row, field, value) {
                console.log (
                  arguments.callee.name + "(column, row, field, value) =>",
                  field,
                  "=",
                  value,
                  column,
                  row
                );
                }



                $scope.myFn = function ($row) {
                alert ("$scope.myFn($row):\n" + JSON.stringify($row, null, "    "));
                };

                var amount = 1234;
                var db = [];
                for (var i=1; i<=amount; i++) {
                var name = "nikhil";
                db.push({
                  "id":i,
                  name: name,
                  email: name.toLowerCase().replace(/[^a-z]+/ig, ".") + "@mail.com"
                });
                }

                function dataProvider (request, callback) {
                console.log("##REQUEST", request);
                var data = db.slice(0);
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

                //console.log("Exiting table details....");
            }



            
            onload();

            });