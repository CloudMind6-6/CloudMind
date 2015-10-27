
app.controller('RootListCtrl', ['$scope', '$state', 'NodeStore',function($scope, $state, NodeStore) {

  $scope.selectRootNode = function(_idx) {
    console.log(NodeStore.getNodeList());
      // $http 데이터 불러와서 서비스 모듈에 넣기
    $state.go('app.mindmap');

  }
    $scope.roots = [{
      idx : '11',
      name : 'ROOT NODE',
      due_date : '2015-12-12',
      assignedUsers :[{
        pic : 'img/a1.jpg'
      },
        {
          pic : 'img/a1.jpg'
        },
        {
          pic : 'img/a1.jpg'
        }]
    },
      {
        idx : '22',
        name : 'ROOT NODE',
        due_date : '2015-12-12',
        assignedUsers :[{
          pic : 'img/a1.jpg'
        },
          {
            pic : 'img/a1.jpg'
          },
          {
            pic : 'img/a1.jpg'
          }]
      },
      {
        idx : '33',
        name : 'ROOT NODE',
        due_date : '2015-12-12',
        assignedUsers :[{
          pic : 'img/a1.jpg'
        },
          {
            pic : 'img/a1.jpg'
          }]
      }]
  }]);