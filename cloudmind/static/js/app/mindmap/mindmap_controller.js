// Scene Graph Class

var scene_graph;

SceneGraph = function(view)
{
    this.node_map    = {};
    this.node_root   = null;
    this.node_odd    = null;
    this.node_even   = null;
};

SceneGraph.prototype =
{
    appendNode : function(model)
    {
        console.log(model);

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
                if(this.node_odd.children.length <= this.node_even.children.length)
                    this.node_odd.attachChild(node_new);
                else
                    this.node_even.attachChild(node_new);
            }
            else
            {
                node_parent.attachChild(node_new);
            }
        }
    },

    removeNode : function(idx)
    {
        var node = this.node_map[idx];
        var parent = node.parent;

        parent.detachChild(node);

        this.node_map[idx] = null;
    },

    arrangeHorizontal : function()
    {
        this.node_odd.arrangeHorizontal();
        this.node_even.arrangeHorizontal();
    },
};



// Angular JS Link

app.controller('MindmapCtrl', ['$scope', 'NodeStore', function($scope, nodeStore)
{
    NodeStore = nodeStore;

    var node_list = NodeStore.getNodeList();

    scene_graph = new SceneGraph();

    for(var i = 0; i < node_list.length; ++i)
        scene_graph.appendNode(node_list[i]);

    scene_graph.arrangeHorizontal();


    scene_graph_view = new SceneGraphView();

    for(var i = 0; i < node_list.length; ++i)
        scene_graph_view.appendNode(scene_graph.node_map[node_list[i].node_idx]);
}]);