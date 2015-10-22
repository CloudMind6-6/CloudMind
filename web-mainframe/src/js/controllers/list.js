'use strict';

/* Controllers */

app
  // Project list controller
  .controller('RootListCtrl', ['$scope', function($scope) {
    $scope.roots = [{
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