app.controller('FullcalendarCtrl', ['$modal','$scope', 'NodeStore', function ( $modal, $scope, NodeStore) {

    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();



    initCalendar();

    function initCalendar(){

        var count = 0;
        $scope.className = 'b-1 b-2x b-info';
        $scope.events    = [];
        $scope.nodes     =  NodeStore.getNodeList();
        $scope.labelPalette = NodeStore.getLabelPalette();

        angular.forEach($scope.nodes, function(value, key){
            $scope.events.push({
                idx      : count++,
                node_idx : value.node_idx,
                title    : value.name,
                start    : value.due_date.substring(0,10),
                info     : value.description
            });
        });

        $scope.eventSources = [$scope.events];
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
    };

    $scope.updateDuedate = function (event, delta, revertFunc, jsEvent, ui, view) {

        var node    = $scope.nodes[event.idx];
        var newDate = event.start.format();

        NodeStore.updateNode(node.node_idx, node.name, newDate,
            node.description, node.assigned_users, function (_node_idx, _node_list) {

                if (!_node_list) {
                    revertFunc();
                    return;
                }

                node.due_date = newDate;
                $scope.nodes = _node_list;
            }
        );
    };

    /* Modal Event Callback*/
    function eventOnModal_addNode(_node, _node_list){

        $scope.nodes = _node_list;
        var length = $scope.nodes.length;

        var source = {
            idx      : length - 1,
            node_idx : _node.node_idx,
            title    : _node.name,
            start    : _node.due_date.substring(0,10),
            info     : _node.description
        };

        $('#calendar').fullCalendar( 'addEventSource', source );
    }

    function eventOnModal_updateNode(){

    }

    function eventOnModal_otherEvents(){

    }



    $scope.modal_callback = {
        addNode       : eventOnModal_addNode,
        updateNode    : null,

        addLabel      : null,
        removeLabel   : null,

        addLeaf       : null,
        removeLeaf    : null,

        addPalette    : null,
        removePalette : null,
        updatePalette : null
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

    /* Change View */
    $scope.today = function (calendar) {
        $('.calendar').fullCalendar('today');
    };
}]);






