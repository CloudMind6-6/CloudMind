
// Scene Graph Form

var scene_graph_form =
{
    root_width:200,
    root_height:100,
    node_width:100,
    node_height:50,
    leaf_width:100,
    leaf_height:100,
    stride_x:30,
    stride_y:30,
    margin_x:20,
    margin_y:20,
};




// Scene Graph Node Class

SceneGraphNode = function(model)
{
    this.parent = null;
    this.children = new Array();
    this.spanning_odd = true;

    this.x = 0;
    this.y = 0;

    if(model == null || model.node_idx == model.root_idx)
    {
        this.width  = scene_graph_form.root_width;
        this.height = scene_graph_form.root_height;
    }
    else
    {
        if (model.leafs.node_idx)
        {
            this.width = scene_graph_form.leaf_width;
            this.height = scene_graph_form.leaf_height;
        }
        else
        {
            this.width = scene_graph_form.node_width;
            this.height = scene_graph_form.node_height;
        }
    }

    this.bounding_width  = this.width  + scene_graph_form.margin_x;
    this.bounding_height = this.height + scene_graph_form.margin_y;

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
        if(child.parent)
            child.parent.detachChild(child);

        child.parent = this;
        child.spanning_odd = this.spanning_odd;
        child.x = this.x;
        child.y = this.y;
        child.link_src_x = this.link_dst_x;
        child.link_src_y = this.link_dst_y;
        child.link_dst_x = this.link_dst_x;
        child.link_dst_y = this.link_dst_y;

        this.children.push(child);

        this.updateUpward();
        child.updateDownward();
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

    updateUpward : function()
    {
        if(this.children.length)
        {
            this.bounding_width  = 0;
            this.bounding_height = 0;

            for(var i = 0; i < this.children.length; ++i)
            {
                var child = this.children[i];

                this.bounding_width  += child.bounding_width;
                this.bounding_height += child.bounding_height;
            }
        }
        else
        {
            this.bounding_width  = this.width  + scene_graph_form.margin_x;
            this.bounding_height = this.height + scene_graph_form.margin_y;
        }

        if(this.parent)
            this.parent.updateUpward();
    },

    updateDownward : function()
    {
        this.spanning_odd = this.parent.spanning_odd;

        for(var i = 0; i < this.children.length; ++i)
        {
            var child = this.children[i];

            child.updateDownward();
        }
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

    arrangeHorizontal : function()
    {
        var child_accum_pos = 0;

        for(var i = 0; i < this.children.length; ++i)
        {
            var child = this.children[i];

            child.y = this.y - (this.bounding_height/2) + child_accum_pos + (child.bounding_height/2);

            child_accum_pos += child.bounding_height;

            if(child.spanning_odd)
            {
                child.x = this.x - (scene_graph_form.stride_x + child.width/2 + this.width/2);

                child.link_src_x = this.x - this.width/2;
                child.link_src_y = this.y;
                child.link_dst_x = child.x + child.width/2;
                child.link_dst_y = child.y;
            }
            else
            {
                child.x = this.x + (scene_graph_form.stride_x + child.width/2 + this.width/2);

                child.link_src_x = this.x + this.width/2;
                child.link_src_y = this.y;
                child.link_dst_x = child.x - child.width/2;
                child.link_dst_y = child.y;
            }

            child.arrangeHorizontal();
        }
    },
}





// Scene Graph View Class

var scene_graph_view = null;

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
    appendNode : function(node)
    {
        var model = node.model;


        // Info

        var div_node_info = this.canvas_node.append('div');

        div_node_info.attr("class", "mindmap_node_info")
            .attr("idx", model.node_idx)
            .style("left", this.center_x + node.x - node.width/2 + "px")
            .style("top", this.center_y + node.y - node.height/2 + "px")
            .style("width", node.width + "px")
            .style("height", node.height + "px")
            .style("border-radius", node.height / 10 + "px")

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
                .attr("src", "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg")
                .attr("width", "10px")
                .attr("height", "10px")
                .style("margin-left", "1px")
        }



        // Menu

        var div_node_menu = this.canvas_node.append('div');

        div_node_menu.attr("class", "mindmap_node_menu")
            .attr("idx", model.node_idx)
            .style("left", this.center_x + node.x - node.width/2 + "px")
            .style("top", this.center_y + node.y - node.height/2 + "px")
            .style("width", node.width + "px")
            .style("height", node.height + "px")
            .style("border-radius", node.height / 10 + "px")
            .on("mouseover", function(){d3.select(this).classed("over", true);})
            .on("mouseout", function(){d3.select(this).classed("over", false);})


        var div_node_menu_side = div_node_menu.append('div').attr("class", "left");

        div_node_menu_side.append('div').append('i').attr("class", "fa fa-lg fa-plus-square")
            .attr("idx", model.node_idx)
            .on("click", function()
            {
                scene_graph.onEventAdd(d3.select(this).attr("idx"))
            });
        div_node_menu_side.append('div').append('i').attr("class", "fa fa-lg fa-trash-o")
            .attr("idx", model.node_idx)
            .on("click", function()
            {
                scene_graph.onEventRemove(d3.select(this).attr("idx"))
            });

        div_node_menu.append('div')
            .attr("class", "right")
            .append('i')
            .attr("idx", model.node_idx)
            .attr("class", "fa fa-2x fa-file-text");



        // Link

        var path_node_link = this.canvas_link.append("path")
            .attr("idx", model.node_idx)
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("d", d3.svg.diagonal()
                .source({x : this.center_y - 50 + node.link_src_y, y : this.center_x + node.link_src_x})
                .target({x : this.center_y - 50 + node.link_dst_y, y : this.center_x + node.link_dst_x})
                .projection(function(d) { return [d.y, d.x]; }));


        // Register

        this.div_node_info_map[model.node_idx] = div_node_info;
        this.div_node_menu_map[model.node_idx] = div_node_menu;
        this.svg_node_link_map[model.node_idx] = path_node_link;
    },

    removeNode : function(node_idx)
    {
        this.canvas_node.selectAll("div[idx='" + node_idx +"']").remove();
        this.canvas_link.selectAll("path[idx='" + node_idx +"']").remove();

        this.div_node_info_map[node_idx] = null;
        this.div_node_menu_map[node_idx] = null;
        this.svg_node_link_map[node_idx] = null;
    },

    setNodePosition : function(node)
    {
        var model = node.model;

        var div_node_info = this.div_node_info_map[model.node_idx];
        var div_node_menu = this.div_node_menu_map[model.node_idx];
        var svg_node_link = this.svg_node_link_map[model.node_idx];

        div_node_info
            .transition()
            .style("left", this.center_x + node.x - node.width/2 + "px")
            .style("top", this.center_y + node.y - node.height/2 + "px")

        div_node_menu
            .transition()
            .style("left", this.center_x + node.x - node.width/2 + "px")
            .style("top", this.center_y + node.y - node.height/2 + "px")

        svg_node_link
            .transition()
            .attr("d", d3.svg.diagonal()
            .source({x : this.center_y - 50 + node.link_src_y, y : this.center_x + node.link_src_x})
            .target({x : this.center_y - 50 + node.link_dst_y, y : this.center_x + node.link_dst_x})
            .projection(function(d) { return [d.y, d.x]; })
        );
    }
}