app.controller('FullcalendarCtrl', ['$modal','$scope', 'NodeStore', function ( $modal, $scope, NodeStore) {

    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();

    $scope.className = 'b-1 b-2x b-info';

    $scope.events = [];

    $scope.modal_callback = {
        addNode : function(){
            console.log('test add node');
        },
        updateNode : null,

        addLabel : function(){
            console.log('test add label');
        },
        removeLabel : null,

        addLeaf : null,
        removeLeaf : null,

        addPalette : null,
        removePalette : null,
        updatePalette : null
    };

    initCalendar();

    function initCalendar(){

        var count = 0;
        $scope.nodes =  NodeStore.getNodeList();
        $scope.labelPalette = NodeStore.getLabelPalette();

        angular.forEach($scope.nodes, function(value, key){
            $scope.events.push({
                idx: count++,
                node_idx: value.node_idx,
                title: value.name,
                start: value.due_date,
                info: value.description
            });
        });
    }

    /* alert on dayClick */
    $scope.precision = 400;
    $scope.lastClickTime = 0;

    $scope.alertOnEventClick = function (node, jsEvent, view) {

        $scope.modalNode = JSON.parse(JSON.stringify( $scope.nodes[node.idx]));

        $scope.staticDate = node.due_date;
        $modal.open({
            templateUrl: 'tpl/modal_nodeview.html',
            controller: 'Modal_NodeView',
            scope: $scope
        });
    };

    /* alert on Resize */
    $scope.alertOnResize = function (event, delta, revertFunc, jsEvent, ui, view) {
        $scope.alertMessage = ('Event Resized to make dayDelta ' + delta);
    };

    $scope.overlay = $('.fc-overlay');
    $scope.alertOnMouseOver = function (event, jsEvent, view) {

        $scope.event = event;
        $scope.overlay.removeClass('left right top').find('.arrow').removeClass('left right top pull-up');
        var wrap = $(jsEvent.target).closest('.fc-event');
        var cal = wrap.closest('.calendar');
        var left = wrap.offset().left - cal.offset().left;
        var right = cal.width() - (wrap.offset().left - cal.offset().left + wrap.width());
        var top = cal.height() - (wrap.offset().top - cal.offset().top + wrap.height());
        if (right > $scope.overlay.width()) {
            $scope.overlay.addClass('left').find('.arrow').addClass('left pull-up')
        } else if (left > $scope.overlay.width()) {
            $scope.overlay.addClass('right').find('.arrow').addClass('right pull-up');
        } else {
            $scope.overlay.find('.arrow').addClass('top');
        }
        if (top < $scope.overlay.height()) {
            $scope.overlay.addClass('top').find('.arrow').removeClass('pull-up').addClass('pull-down')
        }
        (wrap.find('.fc-overlay').length == 0) && wrap.append($scope.overlay);
    }

    $scope.updateDuedate = function (event, delta, revertFunc, jsEvent, ui, view) {

        NodeStore.updateNode(event.node_idx, event.title, event.start.format(), event.info, function (_idx, _node_list) {
            if (!_node_list) {
                revertFunc();
                return;
            }
            $scope.nodes[event.idx].due_date = event.start.format();
            console.log($scope.nodes[event.idx]);
        });
    };

    $scope.uiConfig = {
        calendar: {
            height: 450,
            editable: true,
            header: {
                left: 'prev',
                center: 'title',
                right: 'next'
            },
            eventClick: $scope.alertOnEventClick,
            eventDrop: $scope.updateDuedate,
            eventResize: $scope.alertOnResize,
            eventMouseover: $scope.alertOnMouseOver
        }
    };

    /* add custom event*/
    $scope.addEvent = function () {
        // 노드를 추가하는 화면 호출을 구현해야 함
        var count = 0;
        for (var k in $scope.events) {
            ++count;
        }

        $scope.events.push({
            idx: count,
            title: 'New Event',
            start: new Date(y, m, d),
            className: ['b-l b-2x b-info'], location: 'New York',
            // info:'This a all day event that will start from 9:00 am to 9:00 pm, have fun!'
        });
    };

    /* Change View */
    $scope.today = function (calendar) {
        $('.calendar').fullCalendar('today');
    };

    /* event sources array*/
    $scope.eventSources = [$scope.events];
}]);
/* EOF */






