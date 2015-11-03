/**
 * mindmap controller
 */

label_palette = [
    {palette_number:0, name:"NONE", color:"#80FF80"},
    {palette_number:1, name:"WARNING", color:"#FFFF80"},
    {palette_number:2, name:"ALERT", color:"#FFF080"},
    {palette_number:3, name:"", color:"#8080FF"},
    {palette_number:4, name:"", color:"#FF80FF"},
    {palette_number:5, name:"", color:"#808080"},
    {palette_number:6, name:"", color:"#000000"},
    {palette_number:7, name:"", color:"#FFFFFF"},
];

nodes = [
    {idx:1, parent_idx:1, root_idx:1, name:"node1", desc:"asdfasdfasdf", assigned_users:[1001, 1002, 1003], labels:[0,1], due_date:"2015-11-19"},
    {idx:2, parent_idx:1, root_idx:1, name:"node2", desc:"zxcv", assigned_users:[1001, 1002, 1003], labels:[1,2], due_date:"2015-11-19"},
    {idx:3, parent_idx:2, root_idx:1, name:"node3", desc:"afawefeff", assigned_users:[1001, 1002, 1003], labels:[0,2,1], due_date:"2015-11-19"},
    {idx:4, parent_idx:1, root_idx:1, name:"node4", desc:"AWEFAWVSZDF", assigned_users:[1001, 1002, 1003], labels:[5,6,3], due_date:"2015-11-19"},
    {idx:5, parent_idx:4, root_idx:1, name:"node5", desc:"FAWEFAWEFAWG", assigned_users:[1001, 1002, 1003], labels:[4,7,5], due_date:"2015-11-19"},
    {idx:6, parent_idx:1, root_idx:1, name:"node6", desc:"FAWEFAWEFAWG", assigned_users:[1001, 1002, 1003], labels:[3,2,1], due_date:"2015-11-19"},
    {idx:7, parent_idx:1, root_idx:1, name:"node7", desc:"FAWEFAWEFAWG", assigned_users:[1001, 1002, 1003], labels:[1,4,6,3], due_date:"2015-11-19"},
    {idx:8, parent_idx:1, root_idx:1, name:"node8", desc:"FAWEFAWEFAWG", assigned_users:[1001, 1002, 1003], labels:[0,6], due_date:"2015-11-19"},

    {idx:11, parent_idx:4, root_idx:1, name:"node11", desc:"FAWEFAWEFAWG", assigned_users:[1001, 1002, 1003], labels:[0,7], due_date:"2015-11-19"},
    {idx:12, parent_idx:4, root_idx:1, name:"node12", desc:"FAWEFAWEFAWG", assigned_users:[1001, 1002, 1003], labels:[6,7,1], due_date:"2015-11-19"},
    {idx:13, parent_idx:4, root_idx:1, name:"node13", desc:"45345", assigned_users:[1001, 1002, 1003], labels:[2,3,0], due_date:"2015-11-19"},

    {idx:14, parent_idx:7, root_idx:1, name:"node14", desc:"FAWEFAWEFAWG", assigned_users:[1001, 1002, 1003], labels:[5,1,3], due_date:"2015-11-19"},
    {idx:15, parent_idx:7, root_idx:1, name:"node15", desc:"FAWEFAWEFAWG", assigned_users:[1001, 1002, 1003], labels:[0,7], due_date:"2015-11-19"},
    {idx:16, parent_idx:7, root_idx:1, name:"node16", desc:"FAWEFAWEFAWG", assigned_users:[1001, 1002, 1003], labels:[2,3,1], due_date:"2015-11-19"},

    {idx:17, parent_idx:16, root_idx:1, name:"node17", desc:"FAWEFAWEFAWG", assigned_users:[1001, 1002, 1003], labels:[0,7,6], due_date:"2015-11-19"},

    {idx:20, parent_idx:6, root_idx:1, name:"node20", desc:"FAWEFAWEFAWG", assigned_users:[1001, 1002, 1003], labels:[0,7], due_date:"2015-11-19"},
    {idx:21, parent_idx:6, root_idx:1, name:"node21", desc:"FAWEFAWEFAWG", assigned_users:[1001, 1002, 1003], labels:[0,7], due_date:"2015-11-19"},
    {idx:22, parent_idx:6, root_idx:1, name:"node22", desc:"FAWEFAWEFAWG", assigned_users:[1001, 1002, 1003], labels:[0,7], due_date:"2015-11-19"},

    {idx:24, parent_idx:8, root_idx:1, name:"node24", desc:"FAWEFAWEFAWG", assigned_users:[1001, 1002, 1003], labels:[0,7], due_date:"2015-11-19"},

    {idx:30, parent_idx:24, root_idx:1, name:"node30", desc:"FAWEFAWEFAWG", assigned_users:[1001, 1002, 1003], labels:[0,7], due_date:"2015-11-19"},
    {idx:31, parent_idx:24, root_idx:1, name:"node31", desc:"FAWEFAWEFAWG", assigned_users:[1001, 1002, 1003], labels:[0,7], due_date:"2015-11-19"},
    {idx:32, parent_idx:24, root_idx:1, name:"node32", desc:"FAWEFAWEFAWG", assigned_users:[1001, 1002, 1003], labels:[0,7], due_date:"2015-11-19"},
    {idx:33, parent_idx:24, root_idx:1, name:"node33", desc:"FAWEFAWEFAWG", assigned_users:[1001, 1002, 1003], labels:[0,7], due_date:"2015-11-19"},
];


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

var scene_graph_node_link = new Array();

scene_graph_node_odd.arrangeHorizontal(scene_graph_node_link);
scene_graph_node_even.arrangeHorizontal(scene_graph_node_link);


// Angular JS Link

app.controller('MindmapCtrl', ['$scope', function($scope) {
    $scope.label_palette = label_palette;
    $scope.nodes = nodes;
}]);