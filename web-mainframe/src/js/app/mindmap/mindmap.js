/**
 * mindmap controller
 */

app.controller('MindmapCtrl', ['$scope', function($scope) {

    $scope.label_palette = [
        {palette_number:0, name:"NONE", color:"#80FF80"},
        {palette_number:1, name:"WARNING", color:"#FFFF80"},
        {palette_number:2, name:"ALERT", color:"#FFF080"},
        {palette_number:3, name:"", color:"#8080FF"},
        {palette_number:4, name:"", color:"#FF80FF"},
        {palette_number:5, name:"", color:"#808080"},
        {palette_number:6, name:"", color:"#000000"},
        {palette_number:7, name:"", color:"#FFFFFF"},
    ];

    $scope.nodes = [
        {idx:1, parent_idx:1, root_idx:1, name:"node1", desc:"asdfasdfasdf", assigned_user:[1001, 1002, 1003], labels:[0,1], due_date:"2015-11-19"},
        {idx:2, parent_idx:1, root_idx:1, name:"node2", desc:"zxcv", assigned_user:[1001, 1002, 1003], labels:[1,2], due_date:"2015-11-19"},
        {idx:3, parent_idx:2, root_idx:1, name:"node3", desc:"afawefeff", assigned_user:[1001, 1002, 1003], labels:[0,2], due_date:"2015-11-19"},
        {idx:4, parent_idx:1, root_idx:1, name:"node4", desc:"AWEFAWVSZDF", assigned_user:[1001, 1002, 1003], labels:[5,6], due_date:"2015-11-19"},
        {idx:5, parent_idx:4, root_idx:1, name:"node5", desc:"FAWEFAWEFAWG", assigned_user:[1001, 1002, 1003], labels:[0,7], due_date:"2015-11-19"},
    ];



}]);
