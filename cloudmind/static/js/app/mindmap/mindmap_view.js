
// Scene Graph Form

var scene_graph_form =
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

SceneGraphNode = function(model)
{
    this.parent = null;
    this.children = new Array();
    this.spanning_odd = true;
    this.x = 0;
    this.y = 0;
    this.width  = scene_graph_form.width  + scene_graph_form.margin_x;
    this.height = scene_graph_form.height + scene_graph_form.margin_y;
    this.link_src_x = 0;
    this.link_src_y = 0;
    this.link_dst_x = 0;
    this.link_dst_y = 0;

    this.model = model;
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

    detachChild : function(child)
    {
        for(var i = 0; i < this.children.length; ++i)
        {
            if(this.children[i] == child)
            {
                this.children.splice(i, 1);
                break;
            }
        }

        this.updateUpward();
    },

    getChildrenRecursive : function(children)
    {
        for(var i = 0; i < this.children.length; ++i)
        {
            var child = this.children[i];

            child.getChildrenRecursive(children);
            children.push(child);
        }
    },

    updateUpward : function()
    {
        if(this.children.length)
        {
            this.width = 0;
            this.height = 0;

            for(var i = 0; i < this.children.length; ++i)
            {
                var child = this.children[i];

                this.width  += child.width;
                this.height += child.height;
            }
        }
        else
        {
            this.width  = scene_graph_form.width  + scene_graph_form.margin_x;
            this.height = scene_graph_form.height + scene_graph_form.margin_y;
        }

        if(this.parent)
            this.parent.updateUpward();
    },

    arrangeHorizontal : function()
    {
        var child_current_pos = 0;

        for(var i = 0; i < this.children.length; ++i)
        {
            var child = this.children[i];

            child.y = this.y - (this.height/2) + child_current_pos + (child.height/2);

            if(this.spanning_odd)
            {
                child.x = this.x - scene_graph_form.stride_x;

                child.link_src_x = this.x - scene_graph_form.half_width;
                child.link_src_y = this.y;
                child.link_dst_x = child.x + scene_graph_form.half_width;
                child.link_dst_y = child.y;
            }
            else
            {
                child.x = this.x + scene_graph_form.stride_x;

                child.link_src_x = this.x + scene_graph_form.half_width;
                child.link_src_y = this.y;
                child.link_dst_x = child.x - scene_graph_form.half_width;
                child.link_dst_y = child.y;
            }

            child_current_pos += child.height;

            child.arrangeHorizontal();
        }
    },
}





// Scene Graph View Class

var scene_graph_view = null;
var sn = nodes.length;

SceneGraphView = function()
{
    this.body        = d3.select("body");
    this.canvas_node = this.body.select("div[ng-controller='MindmapCtrl']");
    this.canvas_link = this.canvas_node.select("svg");
    this.center_x    = screen.width  / 2;
    this.center_y    = screen.height / 2 - 40;

    this.div_node_info_map = new Object();
    this.div_node_menu_map = new Object();
    this.svg_node_link_map = new Object();
}

SceneGraphView.prototype =
{
    onClickAdd : function()
    {
        var new_idx = ++sn;
        var new_model = {idx:new_idx, parent_idx:d3.select(this).attr("idx"), root_idx:1, name:"node" + new_idx, desc:"FAWEFAWEFAWG", assigned_users:[1001, 1002], labels:[1,4], due_date:"2015-11-19"};

        nodes.push(new_model);

        scene_graph.appendNode(new_model);
        scene_graph.arrangeHorizontal();

        scene_graph_view.appendNode(scene_graph.node_map[new_idx]);

        for(var i = 0; i < nodes.length; ++i)
        {
            var idx = nodes[i].idx;

            scene_graph_view.setNodePosition(scene_graph.node_map[idx]);
        }
    },

    onClickRemove : function()
    {
        var remove_idx = d3.select(this).attr("idx");
        var remove_node = scene_graph.node_map[remove_idx];
        var remove_node_array = new Array();

        remove_node.getChildrenRecursive(remove_node_array);
        remove_node_array.push(remove_node);

        for(var i = 0; i < remove_node_array.length; ++i)
        {
            for(var j = 0; j < nodes.length; ++j)
            {
                if(nodes[j].idx == remove_node_array[i].model.idx)
                {
                    nodes.splice(j, 1);
                    break;
                }
            }

            scene_graph.removeNode(remove_node_array[i].model.idx);
            scene_graph_view.removeNode(remove_node_array[i].model.idx);
        }

        scene_graph.arrangeHorizontal();

        for(var i = 0; i < nodes.length; ++i)
        {
            var idx = nodes[i].idx;

            scene_graph_view.setNodePosition(scene_graph.node_map[idx]);
        }
    },

    appendNode : function(node)
    {
        var model = node.model;


        // Info

        var div_node_info = this.canvas_node.append('div');

        div_node_info.attr("class", "mindmap_node_info")
            .attr("idx", model.idx)
            .style("left", this.center_x - scene_graph_form.half_width  + node.x + "px")
            .style("top",  this.center_y - scene_graph_form.half_height + node.y + "px")
            .style("width", scene_graph_form.width + "px")
            .style("height", scene_graph_form.height + "px")
            .style("border-radius", scene_graph_form.height / 10 + "px")

        var ul_node_label_container = div_node_info.append('ul').attr("class", "nav navbar-nav");

        for(var j = 0; j < model.labels.length; ++j)
        {
            var label = model.labels[j];

            ul_node_label_container.append('li')
                .attr("class", "mindmap_label")
                .style("background-color", label_palette[label].color);
        }

        div_node_info.append('div')
            .attr("class", "description")
            .text(model.name);

        var div_node_assigned_container = div_node_info.append('div')
            .attr("class", "assigned");

        for(var j = 0; j < model.assigned_users.length; ++j)
        {
            var assigned_user = model.assigned_users[j];

            div_node_assigned_container.append('img')
                .attr("ng-src", "img/a1.jpg")
                .attr("width", "10px")
                .attr("height", "10px")
                .style("margin-left", "1px")
        }



        // Menu

        var div_node_menu = this.canvas_node.append('div');

        div_node_menu.attr("class", "mindmap_node_menu")
            .attr("idx", model.idx)
            .style("left", this.center_x - scene_graph_form.half_width  + node.x + "px")
            .style("top",  this.center_y - scene_graph_form.half_height + node.y + "px")
            .style("width", scene_graph_form.width + "px")
            .style("height", scene_graph_form.height + "px")
            .style("border-radius", scene_graph_form.height / 10 + "px")
            .on("mouseover", function(){d3.select(this).classed("over", true);})
            .on("mouseout", function(){d3.select(this).classed("over", false);})


        var div_node_menu_side = div_node_menu.append('div').attr("class", "left");

        div_node_menu_side.append('div').append('i').attr("class", "fa fa-lg fa-plus-square")
            .attr("idx", model.idx)
            .on("click", this.onClickAdd);
        div_node_menu_side.append('div').append('i').attr("class", "fa fa-lg fa-trash-o")
            .attr("idx", model.idx)
            .on("click", this.onClickRemove);

        div_node_menu.append('div')
            .attr("class", "right")
            .append('i')
            .attr("idx", model.idx)
            .attr("class", "fa fa-2x fa-file-text");



        // Link

        var path_node_link = this.canvas_link.append("path")
            .attr("idx", model.idx)
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("d", d3.svg.diagonal()
                .source({x : this.center_y - 50 + node.link_src_y, y : this.center_x + node.link_src_x})
                .target({x : this.center_y - 50 + node.link_dst_y, y : this.center_x + node.link_dst_x})
                .projection(function(d) { return [d.y, d.x]; }));


        // Register

        this.div_node_info_map[model.idx] = div_node_info;
        this.div_node_menu_map[model.idx] = div_node_menu;
        this.svg_node_link_map[model.idx] = path_node_link;
    },

    removeNode : function(idx)
    {
        this.canvas_node.selectAll("div[idx='" + idx +"']").remove();
        this.canvas_link.selectAll("path[idx='" + idx +"']").remove();

        this.div_node_info_map[idx] = null;
        this.div_node_menu_map[idx] = null;
        this.svg_node_link_map[idx] = null;
    },

    setNodePosition : function(node)
    {
        var model = node.model;

        var div_node_info = this.div_node_info_map[model.idx];
        var div_node_menu = this.div_node_menu_map[model.idx];
        var svg_node_link = this.svg_node_link_map[model.idx];

        div_node_info
            .style("left", this.center_x - scene_graph_form.half_width  + node.x + "px")
            .style("top",  this.center_y - scene_graph_form.half_height + node.y + "px")

        div_node_menu
            .style("left", this.center_x - scene_graph_form.half_width  + node.x + "px")
            .style("top",  this.center_y - scene_graph_form.half_height + node.y + "px")

        svg_node_link.attr("d", d3.svg.diagonal()
            .source({x : this.center_y - 50 + node.link_src_y, y : this.center_x + node.link_src_x})
            .target({x : this.center_y - 50 + node.link_dst_y, y : this.center_x + node.link_dst_x})
            .projection(function(d) { return [d.y, d.x]; })
        );
    }
}