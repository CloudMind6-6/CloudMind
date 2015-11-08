
app.controller('Modal_NodeView', [ '$scope', '$modalInstance', 'NodeStore', function( $scope, $modalInstance, NodeStore){

    $scope.modal_callback = {
        addNode : 'ADD NODE CALLBACK',
        updateNode : 'UPDATE NODA CALLBACK',

        addLabel : 'ADD LABEL CALLBACK',
        removeLabel : 'REMOVE LABEL CALLBACK',

        addLeaf : 'ADD LEAF CALLBACK',
        removeLeaf : 'REMOVE LEAF CALLBACK',

        addPalette : 'ADD PALETTE CALLBACK',
        removePalette : 'REMOVE PALETTE CALLBACK',
        updatePalette : 'UPDATE PALETTE CALLBACK'
    };

    init_NodeViewModal();

    $scope.cancel = function() {
        $modalInstance.close();
    };

    $scope.applyInModal = function() {

        NodeStore.updateNode($scope.modalNode.node_idx, $scope.modalNode.name, $scope.modalNode.due_date,
            $scope.modalNode.description, $scope.modal_callback.updateNode);

        $modalInstance.close({
            name: $scope.name,
            groupType: $scope.groupType
        });
    };

    $scope.addNodeInModal = function() {
        // 동적으로 추가하고 이름 입력해서 추가하도록 하자 아님 새창을 띄울까.

        $scope.nameInModal = 1;
        if(!$scope.nameInModal) return;

        NodeStore.addNode($scope.nameInModal, $scope.modalNode.parent_idx,
            $scope.modalNode.root_idx, function(){
                //$scope.modal_callback.addNode();

            });
    };

    $scope.clickChildNodeInModal = function(_node){
        //앵귤러에서 조건 걸어서 출력하기
        $scope.modalNode = _node;

    };

    $scope.addLabelInModal = function() {
        NodeStore.addLabel($scope.modalNode.node_idx, $scope.labelPalette.palette_idx,
            function(_node_id,_palette_id,_node_list){
                $scope.modalNode.labels.push(_palette_id);
                $scope.modal_callback.addLabel(_node_id,_palette_id,_node_list);
        });
    };

    $scope.removeLabelInModal = function(){
        NodeStore.removeLabel($scope.modalNode.node_idx, $scope.labelPalette.palette_idx,
            function(_node_id,_palette_id,_node_list){

                $scope.modalNode.labels.push(_palette_id);
                $scope.modal_callback.removeLabel(_node_id,_palette_id,_node_list);
            });
    };

    $scope.addParticipantInModal = function(){

        //

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
        $scope.leafStateInModal = false;

        if(($scope.modalNode.description==null) || ($scope.modalNode.description.length == 0))
            $scope.modalNode.description = 'description';
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

app.controller('AddNodeCtrl', ['$scope', 'HttpSvc', function($scope, HttpSvc) {

    $scope.isEditmode = false;

    initUser();

    $scope.clickEditName = function(){
        $scope.isEditmode = true;
        $scope.newName = $scope.username;
    };

    $scope.updateName = function(){
        $scope.isEditmode = false;
        if(!$scope.newName)
            return;

        HttpSvc.updateName($scope.newName)
            .success(function (res) {
                if (res.success) {
                    $scope.username = $scope.newName;
                }
                else throw new Error;
            })
            .error(function (err) {
                console.log(err);
            });
    };

    $scope.clickCancelBtn = function(){
        $scope.isEditmode = false;
    };

    $scope.updatePicture = function($event){
        angular.element('#fileBtn').trigger('click');

    };

    function initUser() {
        HttpSvc.getProfile()
            .success(function (res) {
                if (res.success) {
                    $scope.username = res.profile.name;
                    $scope.useremail = res.profile.email;
                    $scope.profile_url = res.profile.profile_url;
                }
                else throw new Error;
            })
            .error(function (err) {
                console.log(err);
            });
    }

}]);