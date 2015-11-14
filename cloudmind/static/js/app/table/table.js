

app.controller('TableCtrl', ['$scope', '$timeout', 'HttpSvc' , '$http', 'NodeStore'  , '$state', '$filter', '$modal' , function($scope, $timeout, HttpSvc, $http, NodeStore, $state, $filter, $modal) {
    $scope.nodes = [];
    $scope.nodes_notchange = [];
    

    // data_table = $("#table-work").dataTable();
    var data_table;
    data_table = $("#table-work").dataTable();

    // data_table.api().row.add([ "sdfsdf", "sdfsdf", "sdfsdfsf", "sdfsdf"]).draw();

    

    $("#table-work tbody").on( 'mouseenter', 'tr', function(){
        $(this).css("cursor", "pointer");
    });
    $('#table-work tbody').on( 'click', 'tr',function (){
        var inner = $(this)[0].cells[0].innerHTML;
        var data_idx = $(inner).attr("data-nodeidx");
        $scope.load_modal(data_idx);
    });

    $scope.label_list = function (LabelList, nodeLabel) {
    	$scope.Label_colors = [];
    	var return_list_label; 
    	for (var n in nodeLabel) {
            for (var s in LabelList) {
                if (LabelList[s].palette_idx == nodeLabel[n]) {
                    $scope.Label_colors.push("<div><span style='background-color:" + LabelList[s].color + "; width: 40px; height: 20px;margin-right: 4px;margin-bottom:2px;border-radius: 5px; float:left '></span></div>");
                }
            }
        }
        return_list_label = $scope.Label_colors.join(" ");
        if (return_list_label == "") {
        	return_list_label = "할당되지 않음";
        }
        return return_list_label;
    }
    $scope.assigned_list = function(AssignList) {
    	$scope.fncList = [];
    	var return_list;
   		var count = 0;
    	for (var users in AssignList) {
            if (count < 4) {
                $scope.fncList.push("<img width='20' height='20' src='/api/v1/profile/img/" + AssignList[users] + "' align='center' style='-webkit-border-radius:140px;-moz-border-radius: 140px; background-color :#d0d0d0; margin-right : 4px'>");
            } else {
                if (count < 5) {
                    $scope.fncList.push("<i class='fa fa-users fa-2' style='vertical-align:center'></i>");
                }
            }
            count = count + 1;
        }
        return_list = $scope.fncList.join(" ");
        if (return_list == "") {
        	return_list = "할당되지 않음";
        }
        return return_list;
    	// returns array
    }

    $scope.eventOnModal_addNode = function(_node, _node_list){
    	if (_node) {
    		
    		var user_list = $scope.assigned_list(_node.assigned);
    		var label_pal = NodeStore.getLabelPalette();
    		var label_list = $scope.label_list(_node.labels, label_pal);
    		$scope.Name = "<a data-nodeidx='" + _node.node_idx + "'>" + _node.name + "</a>";
    		var due_date =  $filter('date')(_node.due_date,'yyyy-MM-dd');
    		data_table.api().row.add([$scope.Name, label_list, user_list, due_date]).draw();
    		
    	}
    }

    $scope.eventOnModal_updateNode = function(_node_idx, node_list){
    	
    	// API Usage
    	// fnUpdate ('Value' , 'Table_node_id' , 'column_id');

    	if (_node_idx) {
    		var use = data_table.fnGetNodes();
	    	var labels = NodeStore.getLabelPalette();
	    	
	    	var _node_list = NodeStore.getNodeList();
	    	
	    	var idx_fromtb;
	    	for (var n in use) {
	    		var Innerhtml_cell = use[n].cells;
				var work = Innerhtml_cell[0].innerHTML;
				var nodeindex = $(work).attr("data-nodeidx");
				if (nodeindex == _node_idx) {
					idx_fromtb = use[n]._DT_RowIndex;
				}
	    	}

	    	$scope.i_cells = [];

	    	for (var n in _node_list) {

	    		var node_idx = _node_list[n].node_idx;

	    		if (_node_idx == node_idx) {
	    			
	    			var Nodename = _node_list[n].name;
		            var due_date = _node_list[n].due_date;
		            var labels_list = _node_list[n].labels;

		            var use_email;
		            var use_label;
		            $scope.Label_colors = [];
		            $scope.UserEmail = [];
		            $scope.Name = "<a data-nodeidx='" + _node_list[n].node_idx + "'>" + Nodename + "</a>";

		            var count = 1;
		            var time_format = $filter('date')(due_date,'yyyy-MM-dd'); // time format change
		            use_email = $scope.UserEmail.join(" ");
		            use_label = $scope.Label_colors.join(" ");
		            if (use_email == "") {
		                use_email = "할당되지 않음";
		            }
		            if (use_label == "") {
		                use_label = "할당되지 않음";
		            }
		            
		            use_email = $scope.assigned_list(_node_list[n].assigned_users);

		            $scope.i_cells.push($scope.Name);
		            $scope.i_cells.push($scope.label_list(labels,labels_list));
		            $scope.i_cells.push(time_format);
		            $scope.i_cells.push(use_email);
	    		}
	    	}

	    	
	    	for (var n in $scope.i_cells) {
	    		data_table.fnUpdate($scope.i_cells[n], idx_fromtb , n );
	    	}

    	}
    	

    }

    $scope.modal_callback = {
        addNode : $scope.eventOnModal_addNode,
        updateNode : $scope.eventOnModal_updateNode,

        addLabel : null,
        removeLabel : null,

        addLeaf : null,
        removeLeaf : null,

        addPalette : null,
        removePalette : null,
        updatePalette : null,
    };


    $scope.InitTable = function (node_list, labels) {
        var options = {};
        $scope.tabledata = [];

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

            $scope.tabledata.push({"name" : $scope.Name , "LabelList" : LabelList_join , "date" : time_format , "assigned" :"<div id='list-image' style='display:inline-block;'>" + UserList_join + "</div>" })
            count_idx = count_idx + 1;
        }
        return $scope.tabledata;
    }

    $scope.load_modal  = function (idx_node) {

    	$scope.nodes_notchange = NodeStore.getNodeList();

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

    var node_list = NodeStore.getNodeList();
    var labels = NodeStore.getLabelPalette();

    var TableData_scope = $scope.InitTable(node_list, labels);
    

    for (var n in TableData_scope) {
		data_table.api().row.add([ TableData_scope[n].name , TableData_scope[n].LabelList, TableData_scope[n].date , TableData_scope[n].assigned]).draw();    	
    }
	


}]);



