app.controller('TableCtrl', ['$scope', '$timeout', 'HttpSvc' , '$http', 'NodeStore'  , '$state', '$filter', '$modal' , function($scope, $timeout, HttpSvc, $http, NodeStore, $state, $filter, $modal) {
    $scope.nodes = [];
    $scope.nodes_notchange = [];
    var tbody_count = 0 ;
    $("#nodeTableView tbody").on( 'mouseenter', 'tr', function(){
        $(this).css("cursor", "pointer");
    });
    $('#nodeTableView tbody').on( 'click', 'tr',function (){
        var inner = $(this)[0].cells[0].innerHTML;
        var data_idx = $(inner).attr("data-nodeidx");
        $scope.load_modal(data_idx);
    });
    /* Modal Event Callback*/
    function eventOnModal_addNode(_node, _node_list){

        var length = $scope.nodes.length;

        $scope.events.push({
            idx      : length - 1,
            node_idx : _node.node_idx,
            title    : _node.name,
            start    : _node.due_date.substring(0,10),
            info     : _node.description
        });

        $scope.nodes = _node_list;
    }

    function eventOnModal_updateNode(_node_idx, _node_list){

        
    }

   

    $scope.modal_callback = {
        updateNode    : eventOnModal_updateNode,

    };


    $scope.InitTable = function () {
        var node_list = NodeStore.getNodeList(); // nodelist
        $scope.nodes_notchange = NodeStore.getNodeList();
        var labels = NodeStore.getLabelPalette();
        $scope.Init1 = [];
        var count_idx = 0;
        
        for (var jsons in node_list) {
            var Nodename = node_list[jsons].name;
            var due_date = node_list[jsons].due_date;
            var labels_list = node_list[jsons].labels;
            var UserList_join;
            var LabelList_join;
            $scope.UserEmail = [];
            $scope.Label_colors = [];

            $scope.Name = "<a data-nodeidx='" + node_list[jsons].node_idx + "'>" + Nodename + "</a>";

            for (var n in labels_list) {
                for (var s in labels) {
                    if (labels[s].palette_idx == labels_list[n]) {
                        $scope.Label_colors.push("<div><span style='background-color:" + labels[s].color + "; width: 40px; height: 20px;margin-right: 4px;margin-bottom:2px;border-radius: 5px; float:left '></span></div>");
                    }
                }
            }

            var count = 1;
            for (var users in node_list[jsons].assigned_users) {
                if (count < 4) {
                    $scope.UserEmail.push("<img width='20' height='20' src='/api/v1/profile/img/" + node_list[jsons].assigned_users[users] + "' align='center' style='-webkit-border-radius:140px;-moz-border-radius: 140px; background-color :#d0d0d0; margin-right : 4px'>");
                } else {
                    if (count < 5) {
                        $scope.UserEmail.push("<i class='fa fa-users fa-2' style='vertical-align:center'></i>");
                    }
                }
                count = count + 1;
            }

            UserList_join = $scope.UserEmail.join("");
            LabelList_join = $scope.Label_colors.join(" ");
            if (UserList_join == "") {
                UserList_join = "할당되지 않음";
            }
            if (LabelList_join == "") {
                LabelList_join = "할당되지 않음";
            }
            $scope.times = due_date;
            var time_format = $filter('date')(due_date,'yyyy-MM-dd'); // time format change

            $scope.Init1.push({"name" : $scope.Name , "labels" : LabelList_join  , "due_date" : time_format , "people" : "<div id='list-image' style='display:inline-block;'>" + UserList_join + "</div>" });
            count_idx = count_idx + 1;
        }
        $scope.nodes = $scope.Init1;
    }

    $scope.load_modal  = function (idx_node) {
        for (var n in $scope.nodes_notchange) {
            if ($scope.nodes_notchange[n].node_idx == idx_node) {
                $scope.modalNode = JSON.parse(JSON.stringify($scope.nodes_notchange[n]));
                $scope.staticDate = $scope.nodes_notchange[n].due_date;
                $scope.modalIdx = idx_node;

                $modal.open({
                    templateUrl: 'tpl/modal_nodeview.html',
                    controller: 'Modal_NodeView',
                    scope: $scope
                });
            }
        }        
    }

    $scope.InitTable();
}]);


