
app.controller('Modal_NodeView', [ '$scope', '$modalInstance', 'NodeStore', 'UserStore', function( $scope, $modalInstance, NodeStore, UserStore){

    init_NodeViewModal();

    $scope.cancel = function() {
        $modalInstance.close();
    };

    /* Node */

    $scope.applyInModal = function() {

        var _dueDate = new Date($scope.modalNode.due_date);

        NodeStore.updateNode($scope.modalNode.node_idx, $scope.modalNode.name,_dueDate.toJSON(),
            $scope.newDes, function(_node_idx, _node_list){

                if($scope.modal_callback.updateNode)
                    $scope.modal_callback.updateNode(_node_idx, _node_list);
                $scope.nodes = _node_list;

                $modalInstance.close({
                    name: $scope.name,
                    groupType: $scope.groupType
                });
            });
    };

    $scope.addNodeInModal = function(_nodename) {

        if(!_nodename) return;

        $scope.modal_callback.addNode();

        NodeStore.addNode(_nodename, $scope.modalNode.parent_idx,
            $scope.modalNode.root_idx, function(_node, _node_list
            ){
                if($scope.modal_callback.addNode) $scope.modal_callback.addNode(_node, _node_list);
                $scope.clickChildNodeInModal(_node);
            });
    };

    $scope.clickChildNodeInModal = function(_node){
        $scope.modalNode = JSON.parse(JSON.stringify(_node));
        init_NodeViewModal();
    };

    $scope.filterChildNode = function(_node){

        if(_node.parent_idx == $scope.modalNode.node_idx) return true;
        else return false;
    };

    $scope.filterChildLeaf = function(leaf){

    };
    /* label */

    $scope.addLabelInModal = function(_idx) {
        NodeStore.addLabel($scope.modalNode.node_idx, _idx,
            function(_node_id, _node_list, _palette_id){
                console.log('test label modal');
                $scope.modalNode.labels.push(_palette_id);
                if($scope.modal_callback.addLabel) $scope.modal_callback.addLabel(_node_id,_node_list,_palette_id);
        });
    };

    $scope.removeLabelInModal = function(_idx){
        NodeStore.removeLabel($scope.modalNode.node_idx, _idx,
            function(_node_id, _node_list, _palette_id){
                var idx = $scope.modalNode.labels.indexOf(_palette_id);
                console.log(idx);
                $scope.modalNode.labels.splice(idx, 1);
                console.log($scope.modalNode.labels);
                if($scope.modal_callback.removeLabel) $scope.modal_callback.removeLabel(_node_id,_node_list,_palette_id);
            });
    };

    $scope.hasLabel = function(_idx){

        if($scope.modalNode.labels.indexOf(_idx) == -1) {
            $scope.addLabelInModal(_idx);
        }
        else  $scope.removeLabelInModal(_idx);

    };

    /* Participant */

    $scope.addParticipantInModal = function(){
        console.log('사용자 검색 뷰 필요!');
    };

    /* label palette */
    $scope.editPaletteMode = function(_idx){
        $scope.editPalette[_idx] = true;
        $scope.newPaletteName = $scope.labelPalette[_idx].name;
    };

    $scope.updateLabelPalette = function(_palette, _newPaletteName){

        NodeStore.updateLabelPalette(_palette.palette_idx, _newPaletteName, _palette.color,
            function (_palette) {
                $scope.labelPalette[_palette.palette_idx].name = _palette.name;
                $scope.cancelEditPaletteMode(_palette.palette_idx);
                $scope.modalNode.labels = $scope.modalNode.labels;
                if($scope.modal_callback.updatePalette)
                    $scope.modal_callback.updatePalette(_palette);
            });
    };

    $scope.cancelEditPaletteMode = function(_idx){
        $scope.editPalette[_idx] = false;
    };

    $scope.addLeafInModal = function(){
        console.log($scope.newLeaf);
        NodeStore.addLeaf($scope.newLeaf, $scope.modalNode.node_idx , function(_node_idx, _leaf) {
            console.log(_node_idx, _leaf);
            var file_idx = _leaf.idx;
            $scope.modalNode.leafs.push(_leaf);
        });
    };

    $scope.removeLeafInModal = function(_idx){

    };

    $scope.downloadLeafInModal = function(_idx){
        var URL = "/api/v1/leaf/" + _idx;
        window.open(URL,'_blank');
        return URL + _idx;
    };

    $scope.fileChanged = function(){
        var filename = document.getElementById('leafName').value;
        console.log(filename);
    };

    function init_NodeViewModal(){

        $scope.editPalette = new Object();
        $scope.isEditmode  = false;
        $scope.newDes      = $scope.modalNode.description;
        $scope.newLeaf     = null;

        $scope.modalNode.due_date = $scope.modalNode.due_date.substring(0,10);

        for(var p in $scope.labelPalette){
            $scope.editPalette[p] = false;
        }

        $scope.labelPalette = NodeStore.getLabelPalette();
        $scope.users = UserStore.syncUserList();
    }
}]);

app.controller('DatepickekCtrl', ['$scope', function($scope) {

    $scope.$watch('dt', function () {
            $scope.modalNode.due_date = ($scope.dt.getFullYear() + '-' + $scope.dt.getMonth()+'-'+ $scope.dt.getDate());
            if($scope.modalNode.due_date.length == 9)
                $scope.modalNode.due_date = $scope.modalNode.due_date.slice(0,8) + '0' +$scope.dt.getDate();
        }
    );

    $scope.setDate = function(_date) {
        var date = _date.split('-');
        $scope.dt = new Date(date[0], date[1], date[2]);
    };

    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened = !$scope.opened;
    };

    initDatePicker();

    function initDatePicker(){
        $scope.setDate($scope.modalNode.due_date);
    }

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1,
        class: 'datepicker'
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[1];
}]);
