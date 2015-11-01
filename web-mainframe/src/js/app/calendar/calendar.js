/**
 * calendarDemoApp - 0.1.3
 */

app.controller('FullcalendarCtrl', ['$scope', function($scope) {

    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();

    /* event source that contains custom events on the scope */
    /* 칼럼 형식 : idx, title, start, info */
    /* 노드의 Description = info 를 사용*/
    $scope.events = [
      {"idx" : "1" , title: "Node1" , start : "2015-10-10" , info: "Node1 's Description" ,className: ['b-1 b-2x b-info']},
      {"idx" : "2" , title: "Node2" , start : "2015-10-01" , info: "Node2 's Description" ,className: ['b-1 b-2x b-info']},
      {"idx" : "3" , title: "Node3" , start : "2015-10-02" , info: "Node3 's Description" ,className: ['b-1 b-2x b-info']},
      {"idx" : "4" , title: "Node4" , start : "2015-10-03", info: "Node4 's Description" ,className: ['b-1 b-2x b-info']},
      {"idx" : "5" , title: "Node5" , start : "2015-10-04" , info: "Node5 's Description" ,className: ['b-1 b-2x b-info']},
      {"idx" : "6" , title: "Node6" , start : "2015-10-05" , info: "Node6 's Description" ,className: ['b-1 b-2x b-info']},
      {"idx" : "7" , title: "Node7" , start : "2015-10-06" , info: "Node7 's Description" ,className: ['b-1 b-2x b-info']},
      {"idx" : "8" , title: "Node8" , start : "2015-10-07" , info: "Node8 's Description" ,className: ['b-1 b-2x b-info']},
      {"idx" : "9" , title: "Node1" , start : "2015-10-08" , info: "Node9 's Description" ,className: ['b-1 b-2x b-info']},
      {"idx" : "10" , title: "Node1" , start : "2015-10-09" , info: "Node10 's Description" ,className: ['b-1 b-2x b-info']},
    ];

    /* alert on dayClick */
    $scope.precision = 400;
    $scope.lastClickTime = 0;
    $scope.alertOnEventClick = function( date, jsEvent, view ){
      var count = 0;
      for (var k in $scope.events) {
         ++count;
      }

      var time = new Date().getTime();
      if(time - $scope.lastClickTime <= $scope.precision){
          $scope.events.push({
            idx : count, 
            title: 'New Event',
            start: date,
            className: ['b-l b-2x b-info']
          });
      }
      $scope.lastClickTime = time;

    };
    /* alert on Drop */
    $scope.alertOnDrop = function(event, delta, revertFunc, jsEvent, ui, view){
       $scope.alertMessage = ('Event Droped to make dayDelta ' + delta);
    };
    /* alert on Resize */
    $scope.alertOnResize = function(event, delta, revertFunc, jsEvent, ui, view){
       $scope.alertMessage = ('Event Resized to make dayDelta ' + delta);
    };

    $scope.overlay = $('.fc-overlay');
    $scope.alertOnMouseOver = function( event, jsEvent, view ){
      
      $scope.event = event;
      $scope.overlay.removeClass('left right top').find('.arrow').removeClass('left right top pull-up');
      var wrap = $(jsEvent.target).closest('.fc-event');
      var cal = wrap.closest('.calendar');
      var left = wrap.offset().left - cal.offset().left;
      var right = cal.width() - (wrap.offset().left - cal.offset().left + wrap.width());
      var top = cal.height() - (wrap.offset().top - cal.offset().top + wrap.height());
      if( right > $scope.overlay.width() ) {
        $scope.overlay.addClass('left').find('.arrow').addClass('left pull-up')
      }else if ( left > $scope.overlay.width() ) {
        $scope.overlay.addClass('right').find('.arrow').addClass('right pull-up');
      }else{
        $scope.overlay.find('.arrow').addClass('top');
      }
      if( top < $scope.overlay.height() ) {
        $scope.overlay.addClass('top').find('.arrow').removeClass('pull-up').addClass('pull-down')
      }
      (wrap.find('.fc-overlay').length == 0) && wrap.append( $scope.overlay );
    }

    /* config object */
    $scope.uiConfig = {
      calendar:{
        height: 450,
        editable: true,
        header:{
          left: 'prev',
          center: 'title',
          right: 'next'
        },
        dayClick: $scope.alertOnEventClick,
        eventDrop: $scope.alertOnDrop,
        eventResize: $scope.alertOnResize,
        eventMouseover: $scope.alertOnMouseOver,
        eventMouseout: $scope.alertOnMouseOut,
        eventDrop: function(event, delta, revertFunc) {
          var event_idx = event.idx; // 노드의 idx
          var event_start = event.start.format(); // 드롭시 변경 될 날짜

          // POST Request (노드의 날짜 변경 api 호출 부분) 이 필요

          
          // alert(event.title + " was dropped on " + event.start.format());
          // if (!confirm("Are you sure about this change?")) {
          //   revertFunc(); // 변경사항을 취소하는 함수
          // }
        },

        eventRender: function(event, element, view) {
          /* Add Remove Button with style */
          element.append("<span class='closeon fa fa-trash' style='position: absolute; right : 6px; margin-top : -13px'></span>");
          element.find(".closeon").click(function() {
            var event_idx = event.idx;
            // POST Request (노드의 삭제 api 호출 부분) 이 필요

            $('.calendar').fullCalendar('removeEvents',event.idx);
          });
        }
      }
    };
    /* add custom event*/
    $scope.addEvent = function() {
      // 노드를 추가하는 화면 호출을 구현해야 함
      var count = 0;
      for (var k in $scope.events) {
         ++count;
      }

      $scope.events.push({
        idx : count, 
        title: 'New Event' ,
        start: new Date(y, m, d),
        className: ['b-l b-2x b-info'],location:'New York', 
        // info:'This a all day event that will start from 9:00 am to 9:00 pm, have fun!'
      });

        console.log('asd');
    };

    /* Change View */
    $scope.changeView = function(view, calendar) {
      $('.calendar').fullCalendar('changeView', view);
    };

    $scope.today = function(calendar) {
      $('.calendar').fullCalendar('today');
    };

    /* event sources array*/
    $scope.eventSources = [$scope.events];
}]);
/* EOF */
