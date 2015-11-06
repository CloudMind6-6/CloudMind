// Scene Graph Class

SceneGraph = function()
{
    this.node_map    = {};
    this.node_root   = null;
    this.node_odd    = null;
    this.node_even   = null;
    this.node_spanning_odd = true;
};

SceneGraph.prototype =
{
    construct : function(node_list)
    {
        for(var i = 0; i < node_list.length; ++i)
        {
            var node = node_list[i];
            var scene_graph_node = new SceneGraphNode(node);
            var scene_graph_node_parent = this.node_map[node.parent_idx];

            this.node_map[node.idx] = scene_graph_node;

            if (node.idx == node.root_idx)
            {
                this.node_root = scene_graph_node;

                this.node_odd  = new SceneGraphNode();
                this.node_even = new SceneGraphNode();

                this.node_root.attachChild(this.node_odd);
                this.node_root.attachChild(this.node_even);

                this.node_odd.node_spanning_odd = true;
                this.node_even.node_spanning_odd = false;
            }
            else
            {
                if(node.parent_idx == node.root_idx)
                {
                    if(this.node_spanning_odd)
                        this.node_odd.attachChild(scene_graph_node);
                    else
                        this.node_even.attachChild(scene_graph_node);

                    scene_graph_node.node_spanning_odd = this.node_spanning_odd;
                    this.node_spanning_odd = !this.node_spanning_odd;
                }
                else
                {
                    scene_graph_node_parent.attachChild(scene_graph_node);
                    scene_graph_node.node_spanning_odd = scene_graph_node_parent.node_spanning_odd;
                }
            }
        }
    },

    arrangeHorizontal : function()
    {
        this.node_odd.arrangeHorizontal();
        this.node_even.arrangeHorizontal();
    }
};



// Angular JS Link

app.controller('MindmapCtrl', ['$scope', function($scope) {
    $scope.label_palette = label_palette;
    $scope.nodes = nodes;
}]);