/**
 * mindmap controller
 */

app.controller('MindmapCtrl', ['$scope', function($scope) {}]);

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
    {idx:1, parent_idx:1, root_idx:1, name:"node1", desc:"asdfasdfasdf", assigned_user:[1001, 1002, 1003], labels:[0,1], due_date:"2015-11-19"},
    {idx:2, parent_idx:1, root_idx:1, name:"node2", desc:"zxcv", assigned_user:[1001, 1002, 1003], labels:[1,2], due_date:"2015-11-19"},
    {idx:3, parent_idx:2, root_idx:1, name:"node3", desc:"afawefeff", assigned_user:[1001, 1002, 1003], labels:[0,2], due_date:"2015-11-19"},
    {idx:4, parent_idx:1, root_idx:1, name:"node4", desc:"AWEFAWVSZDF", assigned_user:[1001, 1002, 1003], labels:[5,6], due_date:"2015-11-19"},
    {idx:5, parent_idx:4, root_idx:1, name:"node5", desc:"FAWEFAWEFAWG", assigned_user:[1001, 1002, 1003], labels:[0,7], due_date:"2015-11-19"},
    {idx:6, parent_idx:1, root_idx:1, name:"node6", desc:"FAWEFAWEFAWG", assigned_user:[1001, 1002, 1003], labels:[0,7], due_date:"2015-11-19"},
    {idx:7, parent_idx:1, root_idx:1, name:"node7", desc:"FAWEFAWEFAWG", assigned_user:[1001, 1002, 1003], labels:[0,7], due_date:"2015-11-19"},
    {idx:8, parent_idx:1, root_idx:1, name:"node8", desc:"FAWEFAWEFAWG", assigned_user:[1001, 1002, 1003], labels:[0,7], due_date:"2015-11-19"},

    {idx:11, parent_idx:4, root_idx:1, name:"node11", desc:"FAWEFAWEFAWG", assigned_user:[1001, 1002, 1003], labels:[0,7], due_date:"2015-11-19"},
    {idx:12, parent_idx:4, root_idx:1, name:"node12", desc:"FAWEFAWEFAWG", assigned_user:[1001, 1002, 1003], labels:[0,7], due_date:"2015-11-19"},
    {idx:13, parent_idx:4, root_idx:1, name:"node13", desc:"FAWEFAWEFAWG", assigned_user:[1001, 1002, 1003], labels:[0,7], due_date:"2015-11-19"},

    {idx:14, parent_idx:7, root_idx:1, name:"node14", desc:"FAWEFAWEFAWG", assigned_user:[1001, 1002, 1003], labels:[0,7], due_date:"2015-11-19"},
    {idx:15, parent_idx:7, root_idx:1, name:"node15", desc:"FAWEFAWEFAWG", assigned_user:[1001, 1002, 1003], labels:[0,7], due_date:"2015-11-19"},
    {idx:16, parent_idx:7, root_idx:1, name:"node16", desc:"FAWEFAWEFAWG", assigned_user:[1001, 1002, 1003], labels:[0,7], due_date:"2015-11-19"},

    {idx:17, parent_idx:16, root_idx:1, name:"node17", desc:"FAWEFAWEFAWG", assigned_user:[1001, 1002, 1003], labels:[0,7], due_date:"2015-11-19"},

    {idx:20, parent_idx:6, root_idx:1, name:"node20", desc:"FAWEFAWEFAWG", assigned_user:[1001, 1002, 1003], labels:[0,7], due_date:"2015-11-19"},
    {idx:21, parent_idx:6, root_idx:1, name:"node21", desc:"FAWEFAWEFAWG", assigned_user:[1001, 1002, 1003], labels:[0,7], due_date:"2015-11-19"},
    {idx:22, parent_idx:6, root_idx:1, name:"node22", desc:"FAWEFAWEFAWG", assigned_user:[1001, 1002, 1003], labels:[0,7], due_date:"2015-11-19"},

    {idx:24, parent_idx:8, root_idx:1, name:"node24", desc:"FAWEFAWEFAWG", assigned_user:[1001, 1002, 1003], labels:[0,7], due_date:"2015-11-19"},

    {idx:30, parent_idx:24, root_idx:1, name:"node30", desc:"FAWEFAWEFAWG", assigned_user:[1001, 1002, 1003], labels:[0,7], due_date:"2015-11-19"},
    {idx:31, parent_idx:24, root_idx:1, name:"node31", desc:"FAWEFAWEFAWG", assigned_user:[1001, 1002, 1003], labels:[0,7], due_date:"2015-11-19"},
    {idx:32, parent_idx:24, root_idx:1, name:"node32", desc:"FAWEFAWEFAWG", assigned_user:[1001, 1002, 1003], labels:[0,7], due_date:"2015-11-19"},
    {idx:33, parent_idx:24, root_idx:1, name:"node33", desc:"FAWEFAWEFAWG", assigned_user:[1001, 1002, 1003], labels:[0,7], due_date:"2015-11-19"},
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

NodeSceneGraph = function()
{
    this.parent = null;
    this.children = new Array();
    this.spanning_odd = true;
    this.x = 0;
    this.y = 0;
    this.width  = node_scene_graph_form.width  + node_scene_graph_form.margin_x;
    this.height = node_scene_graph_form.height + node_scene_graph_form.margin_y;
};

NodeSceneGraph.prototype =
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

var node_scene_graph_map    = new Object();
var node_scene_graph_root   = null;
var node_scene_graph_odd    = null;
var node_scene_graph_even   = null;
var spanning_odd = true;

nodes.forEach(function(node)
{
    var node_scene_graph = new NodeSceneGraph();
    var node_scene_graph_parent = node_scene_graph_map[node.parent_idx];

    node_scene_graph_map[node.idx] = node_scene_graph;

    if (node.idx == node.root_idx)
    {
        node_scene_graph_root = node_scene_graph;

        node_scene_graph_odd  = new NodeSceneGraph();
        node_scene_graph_even = new NodeSceneGraph();

        node_scene_graph_root.attachChild(node_scene_graph_odd);
        node_scene_graph_root.attachChild(node_scene_graph_even);

        node_scene_graph_odd.spanning_odd = true;
        node_scene_graph_even.spanning_odd = false;
    }
    else
    {
        if(node.parent_idx == node.root_idx)
        {
            if(spanning_odd)
                node_scene_graph_odd.attachChild(node_scene_graph);
            else
                node_scene_graph_even.attachChild(node_scene_graph);

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

var node_link = new Array();

node_scene_graph_odd.arrangeHorizontal(node_link);
node_scene_graph_even.arrangeHorizontal(node_link);


// Node Transform

nodes.forEach(function(node)
{
    var node_scene_graph = node_scene_graph_map[node.idx];

    node.x = node_scene_graph.x;
    node.y = node_scene_graph.y;
});