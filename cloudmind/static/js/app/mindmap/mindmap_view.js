
// Scene Graph Form

var scene_graph_form =
{
    root_width:200,
    root_height:100,
    node_width:100,
    node_height:50,
    leaf_width:100,
    leaf_height:100,
    stride_x:40,
    stride_y:40,
    margin_x:20,
    margin_y:20,
};




// Scene Graph Node Class

SceneGraphNode = function(model)
{
    this.parent = null;
    this.children = [];
    this.spanning_odd = true;

    this.x = 0;
    this.y = 0;

    if(model == null)
    {
        this.width  = 0;
        this.height = 0;

        this.type = 'null';
    }
    else
    {
        if(model.node_idx == model.root_idx)
        {
            this.width  = scene_graph_form.root_width;
            this.height = scene_graph_form.root_height;

            this.type = 'root';
        }
        else
        {
            if (model.leafs.node_idx)
            {
                this.width = scene_graph_form.leaf_width;
                this.height = scene_graph_form.leaf_height;

                this.type = 'leaf';
            }
            else
            {
                this.width = scene_graph_form.node_width;
                this.height = scene_graph_form.node_height;

                this.type = 'node';
            }
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

    this.div_node_info_map = {};
    this.div_node_menu_map = {};
    this.svg_node_link_map = {};

    this.class_map =
   {
        root:
        {
            node:"mindmap_root_info",
            label:"mindmap_root_label",
            menu:"mindmap_root_menu",
            menu_add:"fa fa-3x fa-plus-square",
            menu_remove:"fa fa-3x fa-minus-square",
            menu_view:"fa fa-5x fa-file-text",
            link:"mindmap_root_link",
            portrait:"mindmap_root_portrait"
        },

        node:
        {
            node:"mindmap_node_info",
            label:"mindmap_node_label",
            menu:"mindmap_node_menu",
            menu_add:"fa fa-lg fa-plus-square",
            menu_remove:"fa fa-lg fa-minus-square",
            menu_view:"fa fa-2x fa-file-text",
            link:"mindmap_node_link",
            portrait:"mindmap_node_portrait"
        },
    };
}

SceneGraphView.prototype =
{
    appendNode : function(node)
    {
        var model = node.model;
        var class_info = this.class_map[node.type];



        // Info

        var div_node_info = this.canvas_node.append('div');

        this.div_node_info_map[model.node_idx] = div_node_info;

        div_node_info.attr("class", class_info.node)
            .attr("idx", model.node_idx)
            .style("left", this.center_x + node.x - node.width/2 + "px")
            .style("top", this.center_y + node.y - node.height/2 + "px")

        this.updateNode(node);



        // Menu

        var div_node_menu = this.canvas_node.append('div');

        this.div_node_menu_map[model.node_idx] = div_node_menu;

        div_node_menu.attr("class", class_info.menu)
            .attr("idx", model.node_idx)
            .style("left", this.center_x + node.x - node.width/2 + "px")
            .style("top", this.center_y + node.y - node.height/2 + "px")
            .on("mouseover", function(){d3.select(this).classed("over", true);})
            .on("mouseout", function(){d3.select(this).classed("over", false);})


        var div_node_menu_side = div_node_menu.append('div').attr("class", "left");

        div_node_menu_side.append('div').append('i')
            .attr("idx", model.node_idx)
            .attr("class", class_info.menu_add)
            .on("click", function(){ scene_graph.onEventAdd(d3.select(this).attr("idx")) });

        div_node_menu_side.append('div').append('i')
            .attr("idx", model.node_idx)
            .attr("class", class_info.menu_remove)
            .on("click", function(){ scene_graph.onEventRemove(d3.select(this).attr("idx")) });

        div_node_menu.append('div').attr("class", "right")
            .append('i')
            .attr("idx", model.node_idx)
            .attr("class", class_info.menu_view)
            .on("click", function(){ scene_graph.onEventView(d3.select(this).attr("idx")) });



        // Link

        var path_node_link = this.canvas_link.append("path")
            .attr("idx", model.node_idx)
            .attr("class", class_info.link)
            .attr("d", d3.svg.diagonal()
                .source({x : this.center_y - 50 + node.link_src_y, y : this.center_x + node.link_src_x})
                .target({x : this.center_y - 50 + node.link_dst_y, y : this.center_x + node.link_dst_x})
                .projection(function(d) { return [d.y, d.x]; }));

        this.svg_node_link_map[model.node_idx] = path_node_link;
    },

    appendLeaf : function(node)
    {

    },

    removeNode : function(node_idx)
    {
        this.canvas_node.selectAll("div[idx='" + node_idx +"']").remove();
        this.canvas_link.selectAll("path[idx='" + node_idx +"']").remove();

        this.div_node_info_map[node_idx] = null;
        this.div_node_menu_map[node_idx] = null;
        this.svg_node_link_map[node_idx] = null;
    },

    updateNodePosition : function(node)
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
    },

    updateLabel : function(node)
    {
        var div_node_info = this.div_node_info_map[node.model.node_idx];
        var class_info = this.class_map[node.type];

        div_node_info.selectAll('ul').remove();

        var ul_node_label_container = div_node_info.append('ul').attr("class", "nav navbar-nav");

        for(var i = 0; i < node.model.labels.length; ++i)
        {
            ul_node_label_container.append('li')
                .attr("class", class_info.label)
                .style("background-color", node_store.getLabelPalette()[node.model.labels[i]].color);
        }
    },

    updateName : function(node)
    {
        var div_node_info = this.div_node_info_map[node.model.node_idx];

        div_node_info.selectAll("div[id='name']").remove();

        div_node_info.append('div')
            .attr("id", "name")
            .attr("class", "description")
            .text(node.model.name);
    },

    updateUsers : function(node)
    {
        var div_node_info = this.div_node_info_map[node.model.node_idx];
        var class_info = this.class_map[node.type];

        div_node_info.selectAll("div[id='users']").remove();

        var div_node_assigned_container = div_node_info.append('div')
            .attr("id", "users")
            .attr("class", "assigned");

        for(var i = 0; i < node.model.assigned_users.length; ++i)
        {
            var user = user_store.syncUserList()[node.model.assigned_users[i]];

            div_node_assigned_container
                .append('span')
                .attr("class", "thumb-xxxs avatar-pl " + class_info.portrait)
                .append('img')
                .attr("src", user.profile_url)
        }
    },

    updateNode : function(node)
    {
        this.updateLabel(node);
        this.updateName(node);
        this.updateUsers(node);
    }
}