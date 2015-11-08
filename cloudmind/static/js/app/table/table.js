app.controller('TableCtrl', ['$scope', '$timeout', 'HttpSvc' , '$http', 'NodeStore'  , '$state', '$filter', function($scope, $timeout, HttpSvc, $http, NodeStore, $state, $filter) {
    $scope.nodes = [];
    function Inittable() {
        var node_list = NodeStore.getNodeList(); // root's nodelist
        
        console.log("node_list v");
        console.log(node_list);
        var labels = NodeStore.getLabelPalette();
		console.log("/label_palette/list v");
        console.log(labels);
        $scope.Init1 = [];

        for (var jsons in node_list) {
            var Nodename = node_list[jsons].name;
            var due_date = node_list[jsons].due_date;
            var labels_list = node_list[jsons].labels;

            var UserList_join;
            var LabelList_join;

            $scope.UserList = [];
            $scope.Label_colors = [];

            for (var n in labels_list) {
                for (var s in labels) {
                    if (labels[s].palette_idx == labels_list[n]) {
                        $scope.Label_colors.push("<div style='background-color:" + labels[s].color +"; width: 40px; height: 20px;margin-right: 4px;margin-bottom:2px; float:left;border-radius: 5px'></div>");
                    }
                }
            }

            for (var users in node_list[jsons].user) {
                $scope.UserList.push(node_list[jsons].user[users].name);
            }

            UserList_join = $scope.UserList.join(",");
            LabelList_join = $scope.Label_colors.join(" ");

            console.log($scope.Label_colors);
            if (UserList_join == "") {
                UserList_join = "할당되지 않음";
            }

            if (LabelList_join == "") {
                LabelList_join = "할당되지 않음";
            }
            $scope.times = due_date;
            var time_format = $filter('date')(due_date,'yyyy-MM-dd');

            $scope.Init1.push({"name" : Nodename , "labels" : LabelList_join , "due_date" : time_format , "people" : UserList_join});

        }
        $scope.nodes = $scope.Init1;
    }

    Inittable();
    

}]);