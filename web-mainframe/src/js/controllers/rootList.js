
app.controller('RootListCtrl', ['$scope', '$state', 'NodeStore',function($scope, $state, NodeStore) {

  var url = 'img/a1.jpg';
  initRootList();

  function initRootList(){

    NodeStore.setNavbarState(false);
    /*
    HttpSvc.getRoots()
        .success(function (res){
          if(res.success) {
            $scope.roots=res.node_list;
          }
          else throw new Error;
        })
        .error(function (err){
          console.log('err');
          // 다이얼로그(에러모듈) 처리
        });*/

    $scope.roots = [{
      idx : '11',
      name : 'ROOT NODE1',
      due_date : '2015-12-12',
      assignedUsers :[{
        idx : '1',
        pic : url
      },
        {
          idx : '1',
          pic : url
        },
        {
          pic : url
        }]
    },
      {
        idx : '22',
        name : 'ROOT NODE2',
        due_date : '2015-12-12',
        assignedUsers :[{
          idx : '1',
          pic : url
        },
          {
            idx : '1',
            pic : url
          },
          {
            idx : '1',
            pic : url
          }]
      },
      {
        idx : '22',
        name : 'ROOT NODE3',
        due_date : '2015-12-12',
        assignedUsers :[{
          idx : '1',
          pic : url
        },
          {
            idx : '1',
            pic : url
          },
          {
            idx : '1',
            pic : url
          }]
      },
      {
        idx : '22',
        name : 'ROOT NODE',
        due_date : '2015-12-12',
        assignedUsers :[{
          idx : '1',
          pic : url
        },
          {
            idx : '1',
            pic : url
          },
          {
            idx : '1',
            pic : url
          }]
      },
      {
        idx : '33',
        name : 'ROOT NODE',
        due_date : '2015-12-12',
        assignedUsers :[{
          idx : '1',
          pic : url
        },
          {
            idx : '1',
            pic : url
          }]
      }]
  }

  $scope.selectRoot = function(_idx) {
    NodeStore.setNodeList(_idx, function() {
      $state.go('app.mindmap');
    });
  };

  $scope.addRoot = function(){

    if(!$scope.rootName) return;

    NodeStore.addNode($scope.rootName, null, function(_idx) {

      $scope.rootName = "";
      $scope.selectRoot(_idx);
    })

  };


}]);

