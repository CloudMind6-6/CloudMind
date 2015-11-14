
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
            /*
            if (model.leafs.node_idx)
            {
                this.width = scene_graph_form.leaf_width;
                this.height = scene_graph_form.leaf_height;

                this.type = 'leaf';
            }
            else
             */
            {
                this.width = scene_graph_form.node_width;
                this.height = scene_graph_form.node_height;

                this.type = 'node';
            }
        }
    }


    this.bounding_width  = this.width  + scene_graph_form.margin_x;
    this.bounding_height = this.height + scene_graph_form.margin_y;
    this.bounding_width_no_margin = this.width;
    this.bounding_height_no_margin = this.height;

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
    this.view_highlighted = false;
    this.view_editing = false;

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
            this.bounding_width_no_margin = 0;
            this.bounding_height_no_margin = 0;

            for(var i = 0; i < this.children.length; ++i)
            {
                var child = this.children[i];

                this.bounding_width  += child.bounding_width;
                this.bounding_height += child.bounding_height;
                this.bounding_width_no_margin += child.bounding_width_no_margin;
                this.bounding_height_no_margin += child.bounding_height_no_margin;
            }
        }
        else
        {
            this.bounding_width  = this.width  + scene_graph_form.margin_x;
            this.bounding_height = this.height + scene_graph_form.margin_y;
            this.bounding_width_no_margin = this.width;
            this.bounding_height_no_margin = this.height;
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

    arrangeHorizontal : function(no_margin)
    {
        var child_accum_pos = 0;

        if(no_margin == null)
            no_margin = false;

        for(var i = 0; i < this.children.length; ++i)
        {
            var child = this.children[i];

            if(no_margin == true)
            {
                child.y = this.y - this.bounding_height_no_margin/2 + child_accum_pos + child.bounding_height_no_margin/2;
                child_accum_pos += child.bounding_height_no_margin;
            }
            else
            {
                child.y = this.y - this.bounding_height/2 + child_accum_pos + child.bounding_height/2;
                child_accum_pos += child.bounding_height;
            }

            if(child.spanning_odd)
            {
                if(no_margin == true)
                {
                    child.x = this.x - (child.width/2 + this.width/2);

                    child.link_src_x = child.x;
                    child.link_src_y = child.y;
                    child.link_dst_x = child.x;
                    child.link_dst_y = child.y;
                }
                else
                {
                    child.x = this.x - (scene_graph_form.stride_x + child.width/2 + this.width/2);

                    child.link_src_x = this.x - this.width/2;
                    child.link_src_y = this.y;
                    child.link_dst_x = child.x + child.width/2;
                    child.link_dst_y = child.y;
                }
            }
            else
            {
                if(no_margin == true)
                {
                    child.x = this.x + (child.width/2 + this.width/2);

                    child.link_src_x = child.x;
                    child.link_src_y = child.y;
                    child.link_dst_x = child.x;
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
            }

            child.arrangeHorizontal(no_margin);
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

    this.view_body
        .on("mousedown", function()
        {
            if(scene_graph.view_dragging_node == null)
                scene_graph.enableSwipingMode()
        })
        .on("dblclick",function()
        {
            scene_graph.node_root.x = 0;
            scene_graph.node_root.y = 0;

            scene_graph.arrangeHorizontal();
        });
};

SceneGraph.prototype =
{
    registerNode : function(model)
    {
        var node = new SceneGraphNode(model);

        this.node_map[model.node_idx] = node;
    },

    appendNode : function(model)
    {
        var node = this.node_map[model.node_idx];
        var node_parent = this.node_map[model.parent_idx];

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
            .on("click", function(){ scene_graph.enableEditMode(scene_graph.getNode(d3.select(this).attr("idx"))) });

        div_node_menu_right.append('div').append('i')
            .attr("idx", model.node_idx)
            .attr("class", class_info.menu_movable)
            .on("mousedown", function(){ scene_graph.enableDraggingMode(scene_graph.getNode(d3.select(this).attr("idx"))) });


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

        this.disableEditMode(node);
        this.disableHighlighted(node);

        if(node.parent)
            node.parent.detachChild(node);

        this.view_node.selectAll("div[idx='" + node_idx +"']").remove();
        this.view_link.selectAll("path[idx='" + node_idx +"']").remove();

        this.node_map[node_idx] = null;
    },

    getNode : function(idx)
    {
        return this.node_map[idx];
    },

    arrangeHorizontal : function(duration)
    {
        this.node_odd.x     = this.node_root.x - this.node_root.width/2;
        this.node_odd.y     = this.node_root.y;
        this.node_even.x    = this.node_root.x + this.node_root.width/2;
        this.node_even.y    = this.node_root.y;

        this.node_odd.arrangeHorizontal();
        this.node_even.arrangeHorizontal();

        this.updateNodePosition(this.node_root, duration);
    },

    updateNodePosition : function(node, duration)
    {
        if(node.type != 'null')
        {
            if(duration == null)
                duration = 250;

            node.view_transitioning = true;

            node.view_info
                .transition()
                .duration(duration)
                .each("end", function(){node.view_transitioning = false;})
                .style("left", this.view_center_x + node.x - node.width/2 + "px")
                .style("top", this.view_center_y + node.y - node.height/2 + "px")

            node.view_menu
                .transition()
                .duration(duration)
                .each("end", function(){node.view_transitioning = false;})
                .style("left", this.view_center_x + node.x - node.width/2 + "px")
                .style("top", this.view_center_y + node.y - node.height/2 + "px")

            node.view_link
                .transition()
                .duration(duration)
                .each("end", function(){node.view_transitioning = false;})
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
                {
                    var model = node.model;

                    if(model.node_idx == -1)
                    {
                        scope.onEventAdd(d3.select(this).attr("idx"), this.value)
                        scope.onEventRemovePreliminary();
                    }
                    else
                        node_store.updateNode(model.node_idx, model.parent_idx, this.value, model.due_date, model.description, model.assigned_users, function(node_idx, node_list)
                        {
                            var node = scene_graph.getNode(node_idx);

                            node.model = node_store.getNode(node_idx);

                            scene_graph.disableEditMode(node);
                            scene_graph.updateName(node);
                        });
                }
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
                .append('img')
                .attr("class", class_info.portrait)
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

        if(duration == null)
            duration = 250;

        node.view_info
            .transition()
            .duration(duration)
            .style("left", this.view_center_x + node.x - node.width/2 + "px")
            .style("top", this.view_center_y + node.y - node.height/2 + "px")
            .style("background-color", "#957acb")

        node.view_menu
            .transition()
            .duration(duration)
            .style("left", this.view_center_x + node.x - node.width/2 + "px")
            .style("top", this.view_center_y + node.y - node.height/2 + "px")

        node.view_link
            .transition()
            .duration(duration)
            .attr("d", d3.svg.diagonal()
                .source({x : this.view_center_y - 50 + node.link_src_y, y : this.view_center_x + node.link_src_x})
                .target({x : this.view_center_y - 50 + node.link_dst_y, y : this.view_center_x + node.link_dst_x})
                .projection(function(d) { return [d.y, d.x]; }))
            .style("stroke-width", "6px")
            .style("stroke", "#957acb")

        this.enableHighlighted(node.parent, duration);
    },

    disableHighlighted : function(node, duration)
    {
        if(node.type == 'null' || node.parent == null || node.view_dragging == true)
            return;

        if(duration == null)
            duration = 250;

        node.view_info
            .transition()
            .duration(duration)
            .style("left", this.view_center_x + node.x - node.width/2 + "px")
            .style("top", this.view_center_y + node.y - node.height/2 + "px")
            .style("background-color", "#82cadd")

        node.view_menu
            .transition()
            .duration(duration)
            .style("left", this.view_center_x + node.x - node.width/2 + "px")
            .style("top", this.view_center_y + node.y - node.height/2 + "px")

        node.view_link
            .transition()
            .duration(duration)
            .attr("d", d3.svg.diagonal()
                .source({x : this.view_center_y - 50 + node.link_src_y, y : this.view_center_x + node.link_src_x})
                .target({x : this.view_center_y - 50 + node.link_dst_y, y : this.view_center_x + node.link_dst_x})
                .projection(function(d) { return [d.y, d.x]; }))
            .style("stroke-width", "2px")
            .style("stroke", "#5aa0b3")

        this.disableHighlighted(node.parent, duration);
    },

    enableEditMode : function(node)
    {
        node.view_menu.style("visibility", "hidden");
        node.view_name.on("mousedown.edit", function(){ node.view_editing = true; });

        this.view_body.on("mousedown.edit", function()
        {
            if(node.view_editing == false)
            {
                if(node.model.node_idx == -1)
                    scope.onEventRemovePreliminary();
                else
                    scene_graph.disableEditMode(node);
            }
        });
        this.view_body.on("keydown.edit", function()
        {
            if(d3.event.keyCode == 27)
            {
                if(node.model.node_idx == -1)
                    scope.onEventRemovePreliminary();
                else
                    scene_graph.disableEditMode(node);
            }
        });

        document.getElementById("input_" + node.model.node_idx).focus();
    },

    disableEditMode : function(node)
    {
        node.view_menu.style("visibility", "visible");
        node.view_editing = false;
        node.view_name.on("mousedown.edit", null);
        this.view_body.on("mousedown.edit", null);
        this.view_body.on("keydown.edit", null);
    },

    enableDraggingMode : function(node)
    {
        console.log("enableDraggingMode");

        this.disableHighlighted(node, 0);

        node.view_dragging = true;
        node.view_info.style("z-index", "0");
        node.view_menu.style("visibility", "hidden");
        node.updateDownward();

        this.view_dragging_node = node;
        this.view_dragging_node_parent = node.parent;

        node.parent.detachChild(node);

        this.arrangeHorizontal();

        this.view_body.on("mouseup.drag", function()
        {
            scene_graph.disableDraggingMode(node);
        });

        this.view_body.on("mousemove.drag", function()
        {
            if(scene_graph.view_dragging_node.parent)
                return;

            node.x = d3.mouse(this)[0] - scene_graph.view_center_x;
            node.y = d3.mouse(this)[1] - scene_graph.view_center_y;

            node.link_src_x = node.link_dst_x = node.x;
            node.link_src_y = node.link_dst_y = node.y;

            node.arrangeHorizontal(true);
            scene_graph.updateNodePosition(node, 0);
        });
    },

    disableDraggingMode : function(node)
    {
        console.log("disableDraggingMode");

        this.view_body.on("mousemove.drag", null);
        this.view_body.on("mouseup.drag", null);

        if(this.view_dragging_node.parent)
        {
            var model = this.view_dragging_node.model;
            var parent_model = this.view_dragging_node.parent.model;

            node_store.updateNode(model.node_idx, parent_model.node_idx, model.name, model.due_date, model.description, model.assigned_users, function(node_idx, node_list)
            {
                var node_updated = scene_graph.getNode(node_idx);
                var model_updated = node_store.getNode(node_idx);

                node_updated.model = model_updated;

                scene_graph.getNode(model_updated.parent_idx).attachChild(node_updated);
            });
        }
        else
            this.view_dragging_node_parent.attachChild(this.view_dragging_node);

        node.view_dragging = false;
        node.view_info.style("z-index", "1");
        node.view_menu.style("visibility", "visible");
        node.updateDownward(false);

        this.arrangeHorizontal();

        this.view_dragging_node = null;
        this.view_dragging_node_parent = null;
    },

    enableSwipingMode : function()
    {
        var pre_x = null;
        var pre_y = null;

        this.view_body.on("mouseup.swipe", function()
        {
            pre_x = null;
            pre_y = null;

            scene_graph.disableSwipingMode();
        });

        this.view_body.on("mousemove.swipe", function()
        {
            var cur_x = d3.mouse(this)[0];
            var cur_y = d3.mouse(this)[1];
            var d_x = pre_x ? cur_x - pre_x : 0;
            var d_y = pre_y ? cur_y - pre_y : 0;

            scene_graph.node_root.x += d_x;
            scene_graph.node_root.y += d_y;

            scene_graph.arrangeHorizontal(0);

            pre_x = cur_x;
            pre_y = cur_y;
        });
    },

    disableSwipingMode : function()
    {
        this.view_body.on("mouseup.swipe", null);
        this.view_body.on("mousemove.swipe", null);
    },
}