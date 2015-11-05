
// Scene Graph Form

var node_scene_graph_form =
{
    width:100,
    height:50,
    half_width:50,
    half_height:25,
    stride_x:150,
    stride_y:75,
    margin_x:20,
    margin_y:20,

/*
    width:200,
    height:100,
    half_width:100,
    half_height:50,
    stride_x:300,
    stride_y:150,
    margin_x:20,
    margin_y:20,
    */
};



// Scene Graph Node Class

SceneGraphNode = function()
{
    this.parent = null;
    this.children = new Array();
    this.spanning_odd = true;
    this.x = 0;
    this.y = 0;
    this.width  = node_scene_graph_form.width  + node_scene_graph_form.margin_x;
    this.height = node_scene_graph_form.height + node_scene_graph_form.margin_y;
};

SceneGraphNode.prototype =
{
    attachChild : function(child)
    {
        child.parent = this;
        child.spanning_odd = this.spanning_odd;

        this.children.push(child);

        this.updateUpward();
    },

    updateUpward : function()
    {
        this.width = 0;
        this.height = 0;

        for(var i = 0; i < this.children.length; ++i)
        {
            var child = this.children[i];

            this.width  += child.width;
            this.height += child.height;
        }

        if(this.parent)
            this.parent.updateUpward();
    },

    arrangeHorizontal : function(link_array)
    {
        var child_current_pos = 0;

        for(var i = 0; i < this.children.length; ++i)
        {
            var child = this.children[i];
            var link = new Object();

            child.y = this.y - (this.height/2) + child_current_pos + (child.height/2);

            if(this.spanning_odd)
            {
                child.x = this.x - node_scene_graph_form.stride_x;

                link.src_x = this.x - node_scene_graph_form.half_width;
                link.src_y = this.y;
                link.dst_x = child.x + node_scene_graph_form.half_width;
                link.dst_y = child.y;
            }
            else
            {
                child.x = this.x + node_scene_graph_form.stride_x;

                link.src_x = this.x + node_scene_graph_form.half_width;
                link.src_y = this.y;
                link.dst_x = child.x - node_scene_graph_form.half_width;
                link.dst_y = child.y;
            }

            child_current_pos += child.height;

            link_array.push(link);

            child.arrangeHorizontal(link_array);
        }
    },
}


// Construct Scene Graph

var scene_graph_node_map    = new Object();
var scene_graph_node_root   = null;
var scene_graph_node_odd    = null;
var scene_graph_node_even   = null;
var spanning_odd = true;
var scene_graph_node_link = new Array();

nodes.forEach(function(node)
{
    var node_scene_graph = new SceneGraphNode();
    var node_scene_graph_parent = scene_graph_node_map[node.parent_idx];

    scene_graph_node_map[node.idx] = node_scene_graph;

    if (node.idx == node.root_idx)
    {
        scene_graph_node_root = node_scene_graph;

        scene_graph_node_odd  = new SceneGraphNode();
        scene_graph_node_even = new SceneGraphNode();

        scene_graph_node_root.attachChild(scene_graph_node_odd);
        scene_graph_node_root.attachChild(scene_graph_node_even);

        scene_graph_node_odd.spanning_odd = true;
        scene_graph_node_even.spanning_odd = false;
    }
    else
    {
        if(node.parent_idx == node.root_idx)
        {
            if(spanning_odd)
                scene_graph_node_odd.attachChild(node_scene_graph);
            else
                scene_graph_node_even.attachChild(node_scene_graph);

            node_scene_graph.spanning_odd = spanning_odd;
            spanning_odd = !spanning_odd;
        }
        else
        {
            node_scene_graph_parent.attachChild(node_scene_graph);
            node_scene_graph.spanning_odd = node_scene_graph_parent.spanning_odd;
        }
    }
});


// Arrange Scene Graph Horizontal

scene_graph_node_odd.arrangeHorizontal(scene_graph_node_link);
scene_graph_node_even.arrangeHorizontal(scene_graph_node_link);



// Angular JS Link

app.controller('MindmapCtrl', ['$scope', function($scope) {
    $scope.label_palette = label_palette;
    $scope.nodes = nodes;
}]);