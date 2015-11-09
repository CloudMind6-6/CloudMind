
app.controller('Modal_NodeView', [ '$scope', '$modalInstance', 'NodeStore', function( $scope, $modalInstance, NodeStore){

    $scope.modal_callback = {
        addNode : null,
        updateNode : null,

        addLabel : null,
        removeLabel : null,

        addLeaf : null,
        removeLeaf : null,

        addPalette : null,
        removePalette : null,
        updatePalette : null
    };

    init_NodeViewModal();

    $scope.cancel = function() {
        $modalInstance.close();
    };

    /* Node */

    $scope.applyInModal = function() {

        NodeStore.updateNode($scope.modalNode.node_idx, $scope.modalNode.name, $scope.modalNode.due_date,

            $scope.modalNode.description, function(_node, _node_list){

                if($scope.modal_callback.updateNode)
                    $scope.modal_callback.updateNode(_node, _node_list);

                $modalInstance.close({
                    name: $scope.name,
                    groupType: $scope.groupType
                });
            });
    };

    $scope.addNodeInModal = function() {

        if(!$scope.modalNode.name) return;

        NodeStore.addNode($scope.modalNode.name, $scope.modalNode.parent_idx,
            $scope.modalNode.root_idx, function(_node, _node_list){
                if($scope.modal_callback.addNode) $scope.modal_callback.addNode(_node, _node_list);
                console.log(_node);
                console.log(_node_list);
                $scope.clickChildNodeInModal(_node);
                $scope.newNode_name = '';
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

    $scope.addLabelInModal = function() {

        NodeStore.addLabel($scope.modalNode.node_idx, $scope.labelPalette.palette_idx,
            function(_node_id,_palette_id,_node_list){
                $scope.modalNode.labels.push(_palette_id);
                if($scope.modal_callback.addLabel) $scope.modal_callback.addLabel(_node_id,_palette_id,_node_list);
        });
    };

    $scope.removeLabelInModal = function(){
        NodeStore.removeLabel($scope.modalNode.node_idx, $scope.labelPalette.palette_idx,
            function(_node_id,_palette_id,_node_list){
                // 라벨지우기!! //  json --> 맵형식으로 관리하면... 바로 지울 수 이씀
                $scope.modalNode.labels.pop(_palette_id);
                $scope.modal_callback.removeLabel(_node_id,_palette_id,_node_list);
            });
    };

    $scope.hasLabel = function(_idx){

        console.log($scope.modalNode.labels);
        console.log(_idx);

        if($scope.modalNode.labels.indexOf(_idx) == -1) {
            console.log('없당');
            $scope.addLabelInModal();
        }
        else  $scope.removeLabelInModal();

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

    $scope.updateLabelPalette = function(_idx){

        NodeStore.updateLabelPalette($scope.labelPalette[_idx].palette_idx, $scope.newPaletteName, $scope.labelPalette[_idx].color,
            function (_palette, _palette_list) {
                $scope.labelPalette = _palette_list;
                if(!$scope.modal_callback.updatePalette)
                    $scope.modal_callback.updatePalette(_palette, _palette_list);
            });
    }

    $scope.cancelEditPaletteMode = function(_idx){
        $scope.editPalette[_idx] = false;
    };

    $scope.addLeafInModal = function(){
        $scope.leafStateInModal = true;
        // NodeStore.uploadLeaf();

    };

    $scope.removeLeafInModal = function(_idx){

    };

    $scope.downloadLeafInModal = function(_idx){

        //해당 경로 다운로드 요청
        //$scope.selectedNode.leafs[_idx].file_path

    };

    function init_NodeViewModal(){

        $scope.editPalette = [];
        $scope.leafStateInModal = false;
        $scope.isEditmode = false;

        $scope.modalNode.due_date = $scope.modalNode.due_date.substring(0,10);

        for(var i=0;i<8; i++)
            $scope.editPalette.push(false);


        //if(($scope.modalNode.description==null) || ($scope.modalNode.description.length == 0))
        //    $scope.modalNode.description = 'description';

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
