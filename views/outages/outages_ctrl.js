app.controller('outages_ctrl', function($scope, $compile, uiCalendarConfig, $http) {
    /* config object */
    console.log("Test...");
    /*$scope.uiConfig = {
      calendar:{
        height: 450,
        editable: true,
        header:{
          left: 'month basicWeek basicDay agendaWeek agendaDay',
          center: 'title',
          right: 'today prev,next'
        },
        eventClick: $scope.alertEventOnClick,
        eventDrop: $scope.alertOnDrop,
        eventResize: $scope.alertOnResize
      }
    };*/
    $scope.onload = function()
    {
    	$http({
	            method : 'GET',
	            url : 'http://10.204.43.206:5012/calendar',
	    }).then(function successCallback(responsejson) {
	    			
	                $scope.data_received = responsejson.data;
	                var outages_data = $scope.data_received.outage_data;
	                console.log("outages_data : " + JSON.stringify(outages_data));
	                length = outages_data.length;
	                console.log("length : " + length);

	                for(var i = 0; i < length; i++)
	                {
	                	var start_date = outages_data[i].start_date;
	                	var end_date = outages_data[i].end_date;
	                	var type = outages_data[i].type;
	                	var id = outages_data[i].outage_id;
                    var sd = outages_data[i].title;
                    //console.log("sd : " + sd);
	                	$scope.addEvent(start_date, end_date, type, id, sd);
                    //$scope.addEvent(start_date, end_date, type, id);
	                }

	               	length = $scope.events.length;
	               	for(var i = 0; i < length; i++)
	                {
	                	console.log("Start Date : " + $scope.events[i].start );
	                	console.log("End Date : " + $scope.events[i].end );
	                	console.log("Title : " + $scope.events[i].title );
	                }

	        }, 
	        function errorCallback(responseValue) {
	            console.log("error");
    	});
    }

    $scope.onload();

    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();


    
    $scope.changeTo = 'Hungarian';
    /* event source that pulls from google.com */
    $scope.eventSource = {
            //url: "http://www.google.com/calendar/feeds/usa__en%40holiday.calendar.google.com/public/basic",
            //className: 'gcal-event',           // an option!
            //currentTimezone: 'America/Chicago' // an option!
    };
    /* event source that contains custom events on the scope */
    $scope.events = [
      /*{title: 'All Day Event',start: new Date(y, m, 1)},
      {title: 'Long Event',start: new Date(y, m, d - 5),end: new Date(y, m, d - 2)},
      {id: 999,title: 'Repeating Event',start: new Date(y, m, d - 3, 16, 0),allDay: false},
      {id: 999,title: 'Repeating Event',start: new Date(y, m, d + 4, 16, 0),allDay: false},
      {title: 'Outage 1',start: new Date(y, m, d , 19, 0),end: new Date(y, m, d + 2, 22, 30), allDay : false},
      {title: 'Test Event ',start: new Date(2018, 05, 01, 21, 30),end: new Date(2018, 05, 05, 21, 30 ), allDay : false},
      {title: 'Test Event 2',start: '6/2/2018  11:00 AM PST',end: '6/3/2018  9:00 PM PST', allDay : false}*/
    ];
    /* event source that calls a function on every view switch */
    $scope.eventsF = function (start, end, timezone, callback) {
	  console.log("eventsF called..");
      var s = new Date(start).getTime() / 1000;
      var e = new Date(end).getTime() / 1000;
      var m = new Date(start).getMonth();
      //var events = [{title: 'Feed Me ' + m,start: s + (50000),end: s + (100000),allDay: false, className: ['customFeed']}];
      var events = $scope.events;
      callback(events);
    };

    $scope.calEventsExt = {
       color: '#f00',
       textColor: 'yellow',
       events: [ 
          {type:'party',title: 'Lunch',start: new Date(y, m, d, 12, 0),end: new Date(y, m, d, 14, 0),allDay: false},
          {type:'party',title: 'Lunch 2',start: new Date(y, m, d, 12, 0),end: new Date(y, m, d, 14, 0),allDay: false},
          {type:'party',title: 'Click for Google',start: new Date(y, m, 28),end: new Date(y, m, 29),url: 'http://google.com/'}
        ]
    };
    /* alert on eventClick */
    $scope.alertOnEventClick = function( date, jsEvent, view){
        $scope.alertMessage = (date.title + ' was clicked ');
        
        /*console.log("Title : " + date.title);
        console.log("Start : " + date.start);
        console.log("id : " + date.id);*/
        title = date.title;
        type = title.substr(0,title.indexOf(' '));
        var get_data = {};
        console.log("type : " + type);
        get_data.type = type;
        get_data.id = date.id;

        console.log(JSON.stringify(get_data));

		$http({
            method: 'GET',
            url: 'http://10.204.43.206:5012/get_event',
            params: get_data
        }).then(function successCallback(responsejson) {
        	console.log("test...");
            var data_received = responsejson.data;
           	console.log("data_received : " + JSON.stringify(data_received));
            //console.log("responsejson.data : " + JSON.stringify(responsejson.data));

            var event_details = data_received.event_details;
            console.log("event_details : " + event_details[0]);

            $scope.outage_start = event_details[0].start_date;
            $scope.outage_end = event_details[0].end_date;
            $scope.outage_description = event_details[0].description;
            $scope.outage_type = event_details[0].type;
            $scope.outage_env = event_details[0].environment;
            $scope.outage_staff = event_details[0].impacted_staff;
            $scope.outage_contact = event_details[0].contact;

            $('#myModal').modal('show');
        }, function errorCallback(responseValue) {
            console.log("error");
        });

        
    };
    /* alert on Drop */
     $scope.alertOnDrop = function(event, delta, revertFunc, jsEvent, ui, view){
       $scope.alertMessage = ('Event Droped to make dayDelta ' + delta);
    };
    /* alert on Resize */
    $scope.alertOnResize = function(event, delta, revertFunc, jsEvent, ui, view ){
       $scope.alertMessage = ('Event Resized to make dayDelta ' + delta);
    };
    /* add and removes an event source of choice */
    $scope.addRemoveEventSource = function(sources,source) {
      var canAdd = 0;
      angular.forEach(sources,function(value, key){
        if(sources[key] === source){
          sources.splice(key,1);
          canAdd = 1;
        }
      });
      if(canAdd === 0){
        sources.push(source);
      }
    };
    /* add custom event*/
    $scope.addEvent = function(start_date, end_date, type, id, sd) {
    	console.log("addEvent called...");
    	console.log("start_date : " + start_date);
    	console.log("end_date : " + end_date);
    	console.log("type : " + type);
    	console.log("id : " + id);
      var temp = type + " : " + sd;
      console.log("temp : " + temp);
      $scope.events.push({
        title : temp,
        start : start_date,
        end : end_date, 
        id : id
        //className: ['openSesame']
      });
    };
    /* remove event */
    $scope.remove = function(index) {
      $scope.events.splice(index,1);
    };
    /* Change View */
    $scope.changeView = function(view,calendar) {
    	console.log("changeView called...");
      uiCalendarConfig.calendars[calendar].fullCalendar('changeView',view);
    };
    /* Change View */
    $scope.renderCalender = function(calendar) {
      if(uiCalendarConfig.calendars[calendar]){
      	console.log("renderCalender called...");
        uiCalendarConfig.calendars[calendar].fullCalendar('render');
      }
    };
     /* Render Tooltip */
    $scope.eventRender = function( event, element, view ) { 
        element.attr({'tooltip': event.title,
                     'tooltip-append-to-body': true});
        $compile(element)($scope);
    };
    /* config object */
    $scope.uiConfig = {
      calendar:{
        height: 650,
        editable: true,
        header:{
          left: 'title',
          center: '',
          right: 'today prev,next'
        },
        eventColor: '#0063C3',
        eventClick: $scope.alertOnEventClick,
        eventDrop: $scope.alertOnDrop,
        eventResize: $scope.alertOnResize,
        eventRender: $scope.eventRender,
        displayEventTime : false
      }
    };

    $scope.changeLang = function() {
      if($scope.changeTo === 'Hungarian'){
        $scope.uiConfig.calendar.dayNames = ["Vasárnap", "Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat"];
        $scope.uiConfig.calendar.dayNamesShort = ["Vas", "Hét", "Kedd", "Sze", "Csüt", "Pén", "Szo"];
        $scope.changeTo= 'English';
      } else {
        $scope.uiConfig.calendar.dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        $scope.uiConfig.calendar.dayNamesShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        $scope.changeTo = 'Hungarian';
      }
    };
    /* event sources array*/
    $scope.eventSources = [$scope.events, $scope.eventSource, $scope.eventsF];
    $scope.eventSources2 = [$scope.calEventsExt, $scope.eventsF, $scope.events];
});