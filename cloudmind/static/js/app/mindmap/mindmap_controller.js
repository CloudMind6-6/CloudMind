// Scene Graph Class

var node_store = null;
var user_store = null;
var scope = null;
var modal = null;


// Angular JS Link

app.controller('MindmapCtrl', ['$scope', '$modal', 'UserStore', 'NodeStore', function($scope, $modal, UserStore, NodeStore)
{
    scope = $scope;

    modal = $modal;

    user_store = UserStore;
    node_store = NodeStore;

    var node_list = node_store.getNodeList();
    var leaf_list = node_store.getLeafList();

    scene_graph = new SceneGraph();

    for (var i = 0; i < node_list.length; ++i)
        scene_graph.registerNode(node_list[i]);

    for (var i = 0; i < leaf_list.length; ++i)
        scene_graph.registerNode(leaf_list[i]);

    for (var i = 0; i < node_list.length; ++i)
        scene_graph.appendNode(node_list[i]);

    for (var i = 0; i < leaf_list.length; ++i)
        scene_graph.appendNode(leaf_list[i]);

    scene_graph.arrangeHorizontal();






    scope.onAddNode = function(new_model, model_list)
    {
        scene_graph.registerNode(new_model);
        scene_graph.appendNode(new_model);
        scene_graph.arrangeHorizontal();
    };

    scope.onRemoveNode = function(remove_idx, model_list)
    {
        scene_graph.removeNode(remove_idx);
        scene_graph.arrangeHorizontal();
    };

    scope.onAddLeaf = function(node_idx, leaf, leaf_list)
    {
        scene_graph.registerNode(leaf);
        scene_graph.appendNode(leaf);
        scene_graph.arrangeHorizontal();
    };

    scope.onRemoveLeaf = function(remove_idx, model_list)
    {
        scene_graph.removeNode('leaf_' + remove_idx);
        scene_graph.arrangeHorizontal();
    };

    scope.onUpdateNode = function(model_idx, model_list)
    {
        var node = scene_graph.getNode(model_idx);
        node.model = node_store.getNode(model_idx);
        scene_graph.updateNodeView(node);
    };

    scope.onAddLabel = function(model_idx, model_list, palette_idx)
    {
        var node = scene_graph.getNode(model_idx);
        node.model = node_store.getNode(model_idx);
        scene_graph.updateLabel(node);
    };

    scope.onRemoveLabel = function(model_idx, model_list, palette_idx)
    {
        var node = scene_graph.getNode(model_idx);
        node.model = node_store.getNode(model_idx);
        scene_graph.updateLabel(node);
    };



    scope.onEventAdd = function(node_idx, node_name)
    {
        var model = scene_graph.getNode(node_idx).model;
        node_store.addNode(node_name, model.parent_idx, model.root_idx, scope.onAddNode);
    };

    scope.onEventRemove = function(node_idx)
    {
        node_store.removeNode(node_idx, scope.onRemoveNode);
    };

    scope.onEventDownload = function(leaf_idx)
    {
        var URL = "/api/v1/leaf/" + leaf_idx;
        window.open(URL, '_blank');
    }

    scope.onEventRemoveLeaf = function(leaf_idx)
    {
        node_store.removeLeaf(leaf_idx, scope.onRemoveLeaf);
    }

    scope.onEventAddPreliminary = function(node_idx)
    {
        var model_preliminary = {node_idx:-1, parent_idx:node_idx, root_idx:scene_graph.node_root.model.node_idx, labels:[], assigned_users:[] };

        if(scene_graph.getNode(-1))
            scene_graph.removeNode(-1);

        scope.onAddNode(model_preliminary, node_store.getNodeList());

        scene_graph.updateNodePosition(scene_graph.getNode(-1));
        scene_graph.enableEditMode(scene_graph.getNode(-1));
    };

    scope.onEventRemovePreliminary = function()
    {
        scope.onRemoveNode(-1, node_store.getNodeList());
    };

    scope.onEventView = function(node_idx)
    {
        scope.modalNode = JSON.parse(JSON.stringify( scene_graph.getNode(node_idx).model));

        modal.open
        ({
            templateUrl: 'tpl/modal_nodeview.html',
            controller: 'Modal_NodeView',
            scope: scope
        });
    };

    scope.modal_callback =
    {
        addNode : scope.onAddNode,
        updateNode : scope.onUpdateNode,

        addLabel : null,
        removeLabel : null,

        addLeaf : scope.onAddLeaf,
        removeLeaf : null,

        addPalette : null,
        removePalette : null,
        updatePalette : null,
    };
}]);