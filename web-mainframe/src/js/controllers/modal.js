'use strict';

app.controller('ModalInstanceCtrl', ['$scope', '$modalInstance', 'items', 'positions',function ($scope, $modalInstance, items, positions) {

    $scope.comp = positions;
    $scope.items = items;
    $scope.selected = {
        item: $scope.items[0]
    };

    $scope.ok = function () {
        console.log($scope.comp);
        $modalInstance.close($scope.selected.item);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);

app.controller('ModalCtrl', ['$scope', '$modal', '$log', function ($scope, $modal, $log) {
    $scope.items = ['item1', 'item2', 'item3'];
    $scope.open = function ($event, size ) {
        $scope._position = {
            right: angular.element($event.target).prop('offsetRight'),
            top: angular.element($event.target).prop('offsetTop')
        };
        console.log($scope._position);
        var modalInstance = $modal.open({
            templateUrl: 'myModalContent.html',
            controller: 'ModalInstanceCtrl',
            size: size,
            resolve: {
                positions : function () {
                    return $scope._position;
                },
                items: function () {
                    return $scope.items;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());

        });
    };
}]);
