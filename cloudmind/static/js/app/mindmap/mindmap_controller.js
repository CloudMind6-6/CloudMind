// Scene Graph Class

var node_store = null;
var user_store = null;
var scope = null;
var modal = null;
var scene_graph = null;

SceneGraph = function()
{
    this.node_map   = {};
    this.node_root  = null;
    this.node_odd   = null;
    this.node_even  = null;
};

SceneGraph.prototype =
{
    appendNode : function(model)
    {
        var node_new = new SceneGraphNode(model);
        var node_parent = this.node_map[model.parent_idx];

        this.node_map[model.node_idx] = node_new;

        if (model.node_idx == model.root_idx)
        {
            this.node_root = node_new;

            this.node_odd  = new SceneGraphNode();
            this.node_even = new SceneGraphNode();

            this.node_root.attachChild(this.node_odd);
            this.node_root.attachChild(this.node_even);

            this.node_odd.spanning_odd = true;
            this.node_even.spanning_odd = false;
        }
        else
        {
            if(model.parent_idx == model.root_idx)
            {
                if(this.node_odd.bounding_height <= this.node_even.bounding_height)
                    this.node_odd.attachChild(node_new);
                else
                    this.node_even.attachChild(node_new);
            }
            else
                node_parent.attachChild(node_new);
        }
    },

    removeNode : function(idx)
    {
        var node = this.node_map[idx];

        if(node)
            node.parent.detachChild(node);

        this.node_map[idx] = null;
    },

    arrangeHorizontal : function()
    {
        this.node_odd.x = -this.node_root.width/2;
        this.node_even.x = this.node_root.width/2;

        this.node_odd.arrangeHorizontal();
        this.node_even.arrangeHorizontal();
    },

    onEventAddPreliminary : function(node_idx)
    {
        var model_preliminary = {node_idx:-1, parent_idx:node_idx, root_idx:scene_graph.node_root.model.node_idx, leafs:{}, labels:[], assigned_users:[] };

        scene_graph.removeNode(model_preliminary.node_idx);

        scope.onAddNode(model_preliminary, node_store.getNodeList());

        scene_graph_view.updateNodePosition(scene_graph.node_map[model_preliminary.node_idx]);
        scene_graph_view.enableInputMode(scene_graph.node_map[model_preliminary.node_idx]);
    },

    onEventRemovePreliminary : function()
    {
        scene_graph_view.removeNode(-1);
        scene_graph.removeNode(-1);
    },

    onEventAdd : function(node_idx, node_name)
    {
        var model = scene_graph.node_map[node_idx].model;

        this.onEventRemovePreliminary();

        node_store.addNode(node_name, model.parent_idx, model.root_idx, scope.onAddNode);
    },

    onEventRemove : function(node_idx)
    {
        node_store.removeNode(node_idx, scope.onRemoveNode);
    },

    onEventView : function(node_idx)
    {
        scope.modalNode = JSON.parse(JSON.stringify( scene_graph.node_map[node_idx].model ));

        modal.open
        ({
            templateUrl: 'tpl/modal_nodeview.html',
            controller: 'Modal_NodeView',
            scope: scope
        });
    }
};



// Angular JS Link

app.controller('MindmapCtrl', ['$scope', '$modal', 'UserStore', 'NodeStore', function($scope, $modal, UserStore, NodeStore)
{
    scope = $scope;

    modal = $modal;

    user_store = UserStore;
    node_store = NodeStore;

    var node_list = node_store.getNodeList();

    scene_graph = new SceneGraph();
    scene_graph_view = new SceneGraphView();

    for (var i = 0; i < node_list.length; ++i)
    {
        var node = node_list[i];

        scene_graph.appendNode(node);
        scene_graph_view.appendNode(scene_graph.node_map[node.node_idx]);
    }

    scene_graph.arrangeHorizontal();

    for(var i = 0; i < node_list.length; ++i)
    {
        var node = node_list[i];

        scene_graph_view.updateNodePosition(scene_graph.node_map[node.node_idx]);
    }





    scope.onAddNode = function(new_model, model_list)
    {
        scene_graph.appendNode(new_model);
        scene_graph_view.appendNode(scene_graph.node_map[new_model.node_idx]);

        scene_graph.arrangeHorizontal();

        for(var i = 0; i < model_list.length; ++i)
        {
            var idx = model_list[i].node_idx;

            scene_graph_view.updateNodePosition(scene_graph.node_map[idx]);
        }
    };

    scope.onRemoveNode = function(remove_idx, model_list)
    {
        var remove_node = scene_graph.node_map[remove_idx];
        var remove_node_array = new Array();

        remove_node.getChildrenRecursive(remove_node_array);
        remove_node_array.push(remove_node);

        for(var i = 0; i < remove_node_array.length; ++i)
        {
            scene_graph.removeNode(remove_node_array[i].model.node_idx);
            scene_graph_view.removeNode(remove_node_array[i].model.node_idx);
        }

        scene_graph.arrangeHorizontal();

        for(var i = 0; i < model_list.length; ++i)
        {
            var idx = model_list[i].node_idx;

            scene_graph_view.updateNodePosition(scene_graph.node_map[idx]);
        }
    };

    scope.onUpdateNode = function(model_idx, model_list)
    {
        var node = scene_graph.node_map[model_idx];

        node.model = node_store.getNode(model_idx);

        scene_graph_view.updateNode(node);
    };

    scope.onAddLabel = function(model_idx, model_list, palette_idx)
    {
        var node = scene_graph.node_map[model_idx];

        node.model = node_store.getNode(model_idx);

        scene_graph_view.updateLabel(node);
    };

    scope.onRemoveLabel = function(model_idx, model_list, palette_idx)
    {
        var node = scene_graph.node_map[model_idx];

        node.model = node_store.getNode(model_idx);

        scene_graph_view.updateLabel(node);
    };

    scope.modal_callback =
    {
        addNode : scope.onAddNode,
        updateNode : scope.onUpdateNode,

        addLabel : null,
        removeLabel : null,

        addLeaf : null,
        removeLeaf : null,

        addPalette : null,
        removePalette : null,
        updatePalette : null,
    };
}]);