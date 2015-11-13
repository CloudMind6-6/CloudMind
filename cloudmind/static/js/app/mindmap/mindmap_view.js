
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

    this.view_info = null;
    this.view_menu = null;
    this.view_link = null;
    this.view_name = null;

    this.view_dragging = false;
    this.view_transitioning = false;

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
                child.parent = null;
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

    updateDownward : function(include)
    {
        if(include == null || include == true)
        {
            this.spanning_odd = this.parent.spanning_odd;
            this.view_dragging = this.parent.view_dragging;
        }

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

var scene_graph = null;

SceneGraph = function()
{
    this.node_map   = {};
    this.node_root  = null;
    this.node_odd   = null;
    this.node_even  = null;

    this.view_body      = d3.select("body");
    this.view_node      = this.view_body.select("div[ng-controller='MindmapCtrl']");
    this.view_link      = this.view_node.select("svg");
    this.view_center_x  = screen.width  / 2;
    this.view_center_y  = screen.height / 2 - 40;

    this.view_dragging_node = null;
    this.view_dragging_node_parent = null;

    this.view_class_map =
   {
        root:
        {
            node:"mindmap_root_info",
            label:"mindmap_root_label",
            menu:"mindmap_root_menu",
            menu_add:"fa fa-3x fa-plus-square",
            menu_remove:"fa fa-3x fa-minus-square",
            menu_view:"fa fa-5x fa-file-text",
            menu_edit_name:"fa fa-3x fa-pencil-square",
            menu_movable:"fa fa-3x fa-arrows-alt",
            link:"mindmap_root_link",
            portrait:"mindmap_root_portrait"
        },

        node:
        {
            node:"mindmap_node_info",
            label:"mindmap_node_label",
            menu:"mindmap_node_menu",
            menu_add:"fa fa-1_5x fa-plus-square",
            menu_remove:"fa fa-1_5x fa-minus-square",
            menu_view:"fa fa-2_5x fa-file-text",
            menu_edit_name:"fa fa-1_5x fa-pencil-square",
            menu_movable:"fa fa-1_5x fa-arrows-alt",
            link:"mindmap_node_link",
            portrait:"mindmap_node_portrait"
        },
    };
};

SceneGraph.prototype =
{
    appendNode : function(model)
    {
        var node = new SceneGraphNode(model);
        var node_parent = this.node_map[model.parent_idx];

        this.node_map[model.node_idx] = node;

        if (model.node_idx == model.root_idx)
        {
            this.node_root = node;

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
                    this.node_odd.attachChild(node);
                else
                    this.node_even.attachChild(node);
            }
            else
                node_parent.attachChild(node);
        }



        var class_info = this.view_class_map[node.type];

        // Info

        this.view_node.selectAll("div[idx='"+model.node_idx+"']").remove();
        this.view_node.selectAll("path[idx='"+model.node_idx+"']").remove();

        node.view_info = this.view_node.append('div');

        node.view_info.attr("class", class_info.node)
            .attr("idx", model.node_idx)
            .style("left", this.view_center_x + node.x - node.width/2 + "px")
            .style("top", this.view_center_y + node.y - node.height/2 + "px")

        this.updateNodeView(node);



        // Menu

        var timer = null;

        node.view_menu = this.view_node.append('div');

        node.view_menu.attr("class", class_info.menu)
            .attr("idx", model.node_idx)
            .style("left", this.view_center_x + node.x - node.width/2 + "px")
            .style("top", this.view_center_y + node.y - node.height/2 + "px")
            .style("z-index", "2")
            .on("mouseover", function()
            {
                var node = scene_graph.getNode(model.node_idx);

                scene_graph.enableHighlighted(node);

                if(scene_graph.view_dragging_node)
                {
                    timer = setTimeout(function()
                    {
                        node.attachChild(scene_graph.view_dragging_node);
                        scene_graph.arrangeHorizontal();
                    }, 250);
                }
                else
                    d3.select(this).classed("over", true);
            })
            .on("mouseout", function()
            {
                var node = scene_graph.getNode(model.node_idx);

                scene_graph.disableHighlighted(node);

                clearTimeout(timer);

                if(scene_graph.view_dragging_node && scene_graph.view_dragging_node.parent)
                {
                    scene_graph.view_dragging_node.parent.detachChild(scene_graph.view_dragging_node);
                    scene_graph.arrangeHorizontal();
                }
                else
                    d3.select(this).classed("over", false);
            })


        var div_node_menu_left = node.view_menu.append('div').attr("class", "left");

        div_node_menu_left.append('div').append('i')
            .attr("idx", model.node_idx)
            .attr("class", class_info.menu_add)
            .on("click", function(){ scope.onEventAddPreliminary(d3.select(this).attr("idx")) });

        div_node_menu_left.append('div').append('i')
            .attr("idx", model.node_idx)
            .attr("class", class_info.menu_remove)
            .on("click", function(){ scope.onEventRemove(d3.select(this).attr("idx")) });

        var div_node_menu_right = node.view_menu.append('div').attr("class", "right");

        div_node_menu_right.append('div').append('i')
            .attr("idx", model.node_idx)
            .attr("class", class_info.menu_edit_name)
            //.on("click", function(){ scene_graph.enableEditMode(d3.select(this).attr("idx")) });

        div_node_menu_right.append('div').append('i')
            .attr("idx", model.node_idx)
            .attr("class", class_info.menu_movable)
            .on("mousedown", function(){ scene_graph.enableDraggingMode(d3.select(this).attr("idx")) });


        node.view_menu.append('div').attr("class", "center")
            .append('i')
            .attr("idx", model.node_idx)
            .attr("class", class_info.menu_view)
            .on("click", function(){ scope.onEventView(d3.select(this).attr("idx")) });




        // Link

        node.view_link = this.view_link.append("path")
            .attr("idx", model.node_idx)
            .attr("class", class_info.link)
            .attr("d", d3.svg.diagonal()
                .source({x : this.view_center_y - 50 + node.link_src_y, y : this.view_center_x + node.link_src_x})
                .target({x : this.view_center_y - 50 + node.link_dst_y, y : this.view_center_x + node.link_dst_x})
                .projection(function(d) { return [d.y, d.x]; }));
    },

    appendLeaf : function(node)
    {

    },

    removeNode : function(node_idx)
    {
        var node = this.node_map[node_idx];

        for(var i = 0; i < node.children.length; ++i)
            this.removeNode(node.children[i].model.node_idx);

        this.view_node.selectAll("div[idx='" + node_idx +"']").remove();
        this.view_link.selectAll("path[idx='" + node_idx +"']").remove();

        this.disableEditMode(node);
        this.disableHighlighted(node);

        if(node.parent)
            node.parent.detachChild(node);

        this.node_map[node_idx] = null;
    },

    getNode : function(idx)
    {
        return this.node_map[idx];
    },

    arrangeHorizontal : function()
    {
        this.node_odd.x = -this.node_root.width/2;
        this.node_even.x = this.node_root.width/2;

        this.node_odd.arrangeHorizontal();
        this.node_even.arrangeHorizontal();

        this.updateNodePosition(this.node_root);
    },

    updateNodePosition : function(node, duration)
    {
        var div_node_info = node.view_info;
        var div_node_menu = node.view_menu;
        var svg_node_link = node.view_link;

        if(node.type != 'null')
        {
            if(duration == null)
                duration = 250;

            if(duration > 0)
            {
                div_node_info = div_node_info.transition().duration(duration).each("end", function(){node.view_transitioning = false;});
                div_node_menu = div_node_menu.transition().duration(duration).each("end", function(){node.view_transitioning = false;});
                svg_node_link = svg_node_link.transition().duration(duration).each("end", function(){node.view_transitioning = false;});

                node.view_transitioning = true;
            }

            div_node_info
                .style("left", this.view_center_x + node.x - node.width/2 + "px")
                .style("top", this.view_center_y + node.y - node.height/2 + "px")

            div_node_menu
                .style("left", this.view_center_x + node.x - node.width/2 + "px")
                .style("top", this.view_center_y + node.y - node.height/2 + "px")

            svg_node_link
                .attr("d", d3.svg.diagonal()
                    .source({x : this.view_center_y - 50 + node.link_src_y, y : this.view_center_x + node.link_src_x})
                    .target({x : this.view_center_y - 50 + node.link_dst_y, y : this.view_center_x + node.link_dst_x})
                    .projection(function(d) { return [d.y, d.x]; })
            );

        }

        for(var i = 0; i < node.children.length; ++i)
            this.updateNodePosition(node.children[i], duration);
    },

    updateLabel : function(node)
    {
        var class_info = this.view_class_map[node.type];

        node.view_info.selectAll('ul').remove();

        var ul_node_label_container = node.view_info.append('ul').attr("class", "nav navbar-nav");

        for(var i = 0; i < node.model.labels.length; ++i)
        {
            ul_node_label_container.append('li')
                .attr("class", class_info.label)
                .style("background-color", node_store.getLabelPalette()[node.model.labels[i]].color);
        }
    },

    updateName : function(node)
    {
        node.view_info.selectAll("div[id='name']").remove();

        node.view_name = node.view_info.append('div')
            .attr("id", "name")
            .attr("class", "description")
            .append('input')
            .attr("idx", node.model.node_idx)
            .attr("id", "input_" + node.model.node_idx)
            .attr("class", "input")
            .attr("value", node.model.name)
            .attr("placeholder", "노드 이름")
            .on("keydown", function()
            {
                if(d3.event.keyCode == 13 && this.value != "")
                    scope.onEventAdd(d3.select(this).attr("idx"), this.value)
            });
    },

    updateUsers : function(node)
    {
        var class_info = this.view_class_map[node.type];

        node.view_info.selectAll("div[id='users']").remove();

        var div_node_assigned_container = node.view_info.append('div')
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

    updateNodeView : function(node)
    {
        this.updateLabel(node);
        this.updateName(node);
        this.updateUsers(node);
    },

    enableHighlighted : function(node, duration)
    {
        if(node.type == 'null' || node.parent == null || node.view_dragging == true)
            return;

        var div_node_info = node.view_info;
        var div_node_menu = node.view_menu;
        var svg_node_link = node.view_link;

        if(duration == null)
            duration = 250;

        if(duration > 0)
        {
            div_node_info = div_node_info.transition().duration(duration);
            div_node_menu = div_node_menu.transition().duration(duration);
            svg_node_link = svg_node_link.transition().duration(duration);
        }

        div_node_info
            .style("background-color", "#957acb")

        svg_node_link
            .style("stroke-width", "6px")
            .style("stroke", "#957acb")

        this.enableHighlighted(scene_graph.node_map[node.model.parent_idx], duration);
    },

    disableHighlighted : function(node, duration)
    {
        if(node.type == 'null' || node.parent == null || node.view_dragging == true)
            return;

        var div_node_info = node.view_info;
        var div_node_menu = node.view_menu;
        var svg_node_link = node.view_link;

        if(duration == null)
            duration = 250;

        if(duration > 0)
        {
            div_node_info = div_node_info.transition().duration(duration);
            div_node_menu = div_node_menu.transition().duration(duration);
            svg_node_link = svg_node_link.transition().duration(duration);
        }

        div_node_info
            .style("background-color", "#219fcb")

        svg_node_link
            .style("stroke-width", "2px")
            .style("stroke", "#477499")

        this.disableHighlighted(node.parent, duration);
    },

    enableEditMode : function(node)
    {
        var node_clicked = false;

        node.view_menu.style("visibility", "hidden");
        node.view_name.on("mousedown", function(){ node_clicked = true; });

        this.view_body.on("mousedown", function()
        {
            if(node_clicked == false)
                scope.onEventRemovePreliminary();

            node_clicked = false;
        });
        this.view_body.on("keydown", function()
        {
            if(d3.event.keyCode == 27)
                scope.onEventRemovePreliminary();
        });

        document.getElementById("input_" + node.model.node_idx).focus();
    },

    disableEditMode : function(node)
    {
        node.view_menu.style("visibility", "visible");
        node.view_name.on("mousedown", null);
        this.view_body.on("mousedown", null);
        this.view_body.on("keydown", null);
    },

    enableDraggingMode : function(node_idx)
    {
        var node = scene_graph.node_map[node_idx];

        node.view_dragging = true;
        node.view_info.style("z-index", "0");
        node.view_menu.style("visibility", "hidden");
        node.updateDownward();

        this.view_dragging_node = node;
        this.view_dragging_node_parent = node.parent;

        this.disableHighlighted(node, 0);

        node.parent.detachChild(node);

        this.arrangeHorizontal();

        this.view_body.on("mouseup", function()
        {
            scene_graph.disableDraggingMode(node_idx);
        });

        this.view_body.on("mousemove", function()
        {
            if(scene_graph.view_dragging_node.parent)
                return;

            node.x = d3.mouse(this)[0] - scene_graph.view_center_x;
            node.y = d3.mouse(this)[1] - scene_graph.view_center_y;

            node.link_src_x = node.link_dst_x = node.x;
            node.link_src_y = node.link_dst_y = node.y;

            node.arrangeHorizontal();
            scene_graph.updateNodePosition(node, 0);
        });
    },

    disableDraggingMode : function(node_idx)
    {
        this.view_body.on("mousemove", null);

        var node = this.getNode(node_idx);

        node.view_dragging = false;
        node.view_info.style("z-index", "1");
        node.view_menu.style("visibility", "visible");
        node.updateDownward(false);

        this.view_dragging_node_parent.attachChild(this.view_dragging_node);
        this.view_dragging_node = null;
        this.view_dragging_node_parent = null;

        this.arrangeHorizontal();
    },
}