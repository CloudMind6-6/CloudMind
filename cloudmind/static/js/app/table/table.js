app.controller('TableCtrl', ['$scope', '$timeout', 'HttpSvc' , '$http', 'NodeStore'  , '$state', '$filter', function($scope, $timeout, HttpSvc, $http, NodeStore, $state, $filter) {
    $scope.nodes = [];
    function Inittable() {
        var node_list = NodeStore.getNodeList(); // nodelist
        var labels = NodeStore.getLabelPalette();
        $scope.Init1 = [];

        for (var jsons in node_list) {
            var Nodename = node_list[jsons].name;
            var due_date = node_list[jsons].due_date;
            var labels_list = node_list[jsons].labels;

            var UserList_join;
            var LabelList_join;

            $scope.UserEmail = [];
            $scope.Label_colors = [];

            for (var n in labels_list) {
                for (var s in labels) {
                    if (labels[s].palette_idx == labels_list[n]) {
                        $scope.Label_colors.push("<div style='background-color:" + labels[s].color + "; width: 40px; height: 20px;margin-right: 4px;margin-bottom:2px; float:left;border-radius: 5px'></div>");
                    }
                }
            }

            var count = 1;
            for (var users in node_list[jsons].assigned_users) {
                if (count < 4) {
                    $scope.UserEmail.push("<img width='20' height='20' src='../img/a0.jpg' align='center' style='-webkit-border-radius:140px;-moz-border-radius: 140px; background-color :#d0d0d0; margin-right : 4px'>");
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

            $scope.Init1.push({"name" : Nodename , "labels" : LabelList_join , "due_date" : time_format , "people" : "<div id='list-image' style='display:inline-block; float:left;'>" + UserList_join + "</div>"});
        }
        $scope.nodes = $scope.Init1;
    }

    Inittable();
    

}]);


