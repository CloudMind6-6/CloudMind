
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
    margin_y:20
};



// Scene Graph Node Class

SceneGraphNode = function(model, id)
{
    this.parent = null;
    this.children = [];
    this.id = id;

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
        if (model.id != null)
        {
            this.width = scene_graph_form.leaf_width;
            this.height = scene_graph_form.leaf_height;

            this.type = 'leaf';
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
    this.view_positioning = false;
    this.view_highlighted_parent = false;
    this.view_editing = false;

    this.model = model;
};

SceneGraphNode.prototype =
{
    attachChild : function(child, keep_pos)
    {
        if(child.parent)
            child.parent.detachChild(child);

        child.parent = this;

        if(keep_pos == null)
        {
            child.x = this.x;
            child.y = this.y;
            child.link_src_x = this.link_dst_x;
            child.link_src_y = this.link_dst_y;
            child.link_dst_x = this.link_dst_x;
            child.link_dst_y = this.link_dst_y;
        }

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

    clearChildren : function()
    {
        for(var i = 0; i < this.children.length; ++i)
            this.children[i].parent = null;

        this.children = [];

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
        if(include != false)
            this.view_dragging = this.parent.view_dragging;

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

    move : function(dx, dy)
    {
        this.x += dx;
        this.y += dy;
        this.link_src_x += dx;
        this.link_src_y += dy;
        this.link_dst_x += dx;
        this.link_dst_y += dy;

        for(var i = 0; i < this.children.length; ++i)
            this.children[i].move(dx, dy);
    },
};

arrangeHorizontal = function(node, no_margin, dir)
{
    if(no_margin == null)
        no_margin = false;

    if(dir == 'balanced' || dir == 'fixed')
    {
        var children_left = [];
        var children_right = [];
        var children_copy = node.children.splice(0);

        if(dir == 'balanced')
        {
            var bounding_height_left  = 0;
            var bounding_height_right = 0;

            children_copy.sort(function(l, r)
            {
                if(l.bounding_height == r.bounding_height)
                    return l.id - r.id;
                else
                    return r.bounding_height - l.bounding_height;
            });

            for(var i = 0; i < children_copy.length; ++i)
            {
                var child = children_copy[i];

                var left = true;

                if(Math.abs(bounding_height_left - bounding_height_right) >= 250)
                    left = bounding_height_left <= bounding_height_right;
                else
                    left = child.id % 2 == 0;

                if(left)
                {
                    bounding_height_left += child.bounding_height;
                    children_left.push(child);
                }
                else
                {
                    bounding_height_right += child.bounding_height;
                    children_right.push(child);
                }
            }
        }
        if(dir == 'fixed')
        {
            for(var i = 0; i < children_copy.length; ++i)
            {
                var child = children_copy[i];

                if(child.x < node.x)
                    children_left.push(child);
                else
                    children_right.push(child);
            }
        }

        children_left. sort(function(l, r){ return l.id - r.id; });
        children_right.sort(function(l, r){ return l.id - r.id; });

        node.clearChildren();

        for(var i = 0; i < children_left.length; ++i)
            node.attachChild(children_left[i]);

        arrangeHorizontal(node, no_margin, 'left');

        node.clearChildren();

        for(var i = 0; i < children_right.length; ++i)
            node.attachChild(children_right[i]);

        arrangeHorizontal(node, no_margin, 'right');

        node.clearChildren();

        for(var i = 0; i < children_copy.length; ++i)
            node.attachChild(children_copy[i], true);

        for(var i = 0; i < children_right.length; ++i)
            node.attachChild(children_right[i], true);
    }
    else
    {
        var child_accum_pos = 0;

        for(var i = 0; i < node.children.length; ++i)
        {
            var child = node.children[i];

            if(no_margin == true)
            {
                child.y = node.y - node.bounding_height_no_margin/2 + child_accum_pos + child.bounding_height_no_margin/2;
                child_accum_pos += child.bounding_height_no_margin;
            }
            else
            {
                child.y = node.y - node.bounding_height/2 + child_accum_pos + child.bounding_height/2;
                child_accum_pos += child.bounding_height;
            }

            var dir_factor = (dir == 'left') ? -1 : 1;

            if(no_margin == true)
            {
                child.x = node.x + dir_factor * (child.width/2 + node.width/2);

                child.link_src_x = child.x;
                child.link_src_y = child.y;
                child.link_dst_x = child.x;
                child.link_dst_y = child.y;
            }
            else
            {
                child.x = node.x + dir_factor * (scene_graph_form.stride_x + child.width/2 + node.width/2);

                child.link_src_x = node.x + dir_factor * node.width/2;
                child.link_src_y = node.y;
                child.link_dst_x = child.x - dir_factor * child.width/2;
                child.link_dst_y = child.y;
            }

            arrangeHorizontal(child, no_margin, dir);
        }
    }
};

arrangeVertical = function(node, no_margin, dir)
{
    if(no_margin == null)
        no_margin = false;

    if(dir == 'balanced' || dir == 'fixed')
    {
        var children_up = [];
        var children_down = [];
        var children_copy = node.children.splice(0);

        if(dir == 'balanced')
        {
            var bounding_width_up  = 0;
            var bounding_width_down = 0;

            children_copy.sort(function(l, r){ return r.bounding_width - l.bounding_width; });

            for(var i = 0; i < children_copy.length; ++i)
            {
                var child = children_copy[i];

                var left = true;

                if(Math.abs(bounding_width_up - bounding_width_down) >= 500)
                    left = bounding_width_up <= bounding_width_down;
                else
                    left = child.id % 2 == 0;

                if(left)
                {
                    bounding_width_up += child.bounding_width;
                    children_up.push(child);
                }
                else
                {
                    bounding_width_down += child.bounding_width;
                    children_down.push(child);
                }
            }
        }
        if(dir == 'fixed')
        {
            for(var i = 0; i < children_copy.length; ++i)
            {
                var child = children_copy[i];

                if(child.y < node.y)
                    children_up.push(child);
                else
                    children_down.push(child);
            }
        }

        children_up.  sort(function(l, r){ return l.id - r.id; });
        children_down.sort(function(l, r){ return l.id - r.id; });

        node.clearChildren();

        for(var i = 0; i < children_up.length; ++i)
            node.attachChild(children_up[i]);

        arrangeVertical(node, no_margin, 'up');

        node.clearChildren();

        for(var i = 0; i < children_down.length; ++i)
            node.attachChild(children_down[i]);

        arrangeVertical(node, no_margin, 'down');

        node.clearChildren();

        for(var i = 0; i < children_copy.length; ++i)
            node.attachChild(children_copy[i], true);
    }
    else
    {
        var child_accum_pos = 0;

        for(var i = 0; i < node.children.length; ++i)
        {
            var child = node.children[i];

            if(no_margin == true)
            {
                child.x = node.x - node.bounding_width_no_margin/2 + child_accum_pos + child.bounding_width_no_margin/2;
                child_accum_pos += child.bounding_width_no_margin;
            }
            else
            {
                child.x = node.x - node.bounding_width/2 + child_accum_pos + child.bounding_width/2;
                child_accum_pos += child.bounding_width;
            }

            var dir_factor = (dir == 'up') ? -1 : 1;

            if(no_margin == true)
            {
                child.y = node.y + dir_factor * (child.height/2 + node.height/2);

                child.link_src_x = child.x;
                child.link_src_y = child.y;
                child.link_dst_x = child.x;
                child.link_dst_y = child.y;
            }
            else
            {
                child.y = node.y + dir_factor * (scene_graph_form.stride_y + child.height/2 + node.height/2);

                child.link_src_x = node.x;
                child.link_src_y = node.y + dir_factor * node.height/2;
                child.link_dst_x = child.x;
                child.link_dst_y = child.y - dir_factor * child.height/2;
            }

            arrangeVertical(child, no_margin, dir);
        }
    }
};



// Scene Graph View Class

var scene_graph = null;

SceneGraph = function()
{
    this.node_map   = {};
    this.node_root  = null;
    this.node_next_id = 1;

    this.view_body      = d3.select("body");
    this.view_node      = this.view_body.select("div[ng-controller='MindmapCtrl']");
    this.view_link      = this.view_node.select("svg");
    this.view_center_x  = screen.width  / 2;
    this.view_center_y  = screen.height / 2 - 40;

    this.view_dragging_node = null;
    this.view_dragging_node_parent = null;
    this.arrange_mode = 'horizontal';

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
            menu_arrange:"fa fa-3x fa-sitemap",
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

        leaf:
        {
            node:"mindmap_leaf_info",
            label:"mindmap_leaf_label",
            menu:"mindmap_leaf_menu",
            menu_remove:"fa fa-1_5x fa-minus-square",
            menu_movable:"fa fa-1_5x fa-arrows-alt",
            menu_download:"fa fa-5x fa-cloud-download",
            link:"mindmap_leaf_link",
            portrait:"mindmap_leaf_portrait"
        }
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

            scene_graph.arrange();
        });
};

SceneGraph.prototype =
{
    getNodeIdxFromModel : function(model)
    {
        return model.id != null ? 'leaf_' + model.id : model.node_idx;
    },

    getParentNodeIdxFromModel : function(model)
    {
        return model.id != null ? model.parent_node_id : model.parent_idx;
    },

    getNodeFromModel : function(model)
    {
        return this.node_map[this.getNodeIdxFromModel(model)];
    },

    getParentNodeFromModel : function(model)
    {
        return this.node_map[this.getParentNodeIdxFromModel(model)];
    },

    getNode : function(idx)
    {
        return this.node_map[idx];
    },

    registerNode : function(model)
    {
        this.node_map[this.getNodeIdxFromModel(model)] = new SceneGraphNode(model, this.node_next_id);

        if(model.node_idx != -1)
            ++this.node_next_id;
    },

    appendNode : function(model)
    {
        var node_idx = this.getNodeIdxFromModel(model);
        var node_parent_idx = this.getParentNodeIdxFromModel(model);
        var node = this.getNode(node_idx);
        var node_parent = this.getNode(node_parent_idx);



        if (node.type == 'root')
            this.node_root = node;
        else
            node_parent.attachChild(node);



        var class_info = this.view_class_map[node.type];

        this.view_node.selectAll("div[idx='"+node_idx+"']").remove();
        this.view_node.selectAll("path[idx='"+node_idx+"']").remove();

        // Info

        node.view_info = this.view_node.append('div');

        if(node.type == 'leaf')
        {
            node.view_info.attr("class", class_info.node)
                .attr("idx", node_idx)
                .style("left", this.view_center_x + node.x - node.width/2 + "px")
                .style("top", this.view_center_y + node.y - node.height/2 + "px")
                .style("overflow", "hidden");

            var bg_layer = node.view_info.append('div');

            if(model.file_type.search("image") === 0)
            {
              bg_layer.style("width", "100%")
              .style("height", "75px")
              .style("position", "absolute")
              .style("background-image", "url(/api/v1/leaf/"+model.id+"?t=true)")
              .style("background-color", "rgb(85, 124, 162)")
              .style("background-size", "cover")
              .style("background-position", "center");
            }
            else
            {
              bg_layer.style("width", "100%")
              .style("height", "75px")
              .style("position", "absolute")
              .style("background-color", "rgb(0, 0, 0)")
              .style("background-size", "cover")
              .style("background-position", "center");

              var bg_extname = bg_layer.append('div');
              name_ext = model.name.split('.');
              name_ext = name_ext[name_ext.length - 1];
              bg_extname.text(name_ext)
              .style("font-size", "16pt")
              .style("text-align", "center")
              .style("margin-top", "25px");
            }

            this.updateName(node);
        }
        else
        {
            node.view_info.attr("class", class_info.node)
                .attr("idx", node_idx)
                .style("left", this.view_center_x + node.x - node.width/2 + "px")
                .style("top", this.view_center_y + node.y - node.height/2 + "px");

            this.updateNodeView(node);
        }



        // Menu

        var timer = null;

        node.view_menu = this.view_node.append('div');

        if(node.type == 'leaf')
        {
            node.view_menu.attr("class", class_info.menu)
                .attr("idx", node_idx)
                .style("left", this.view_center_x + node.x - node.width/2 + "px")
                .style("top", this.view_center_y + node.y - node.height/2 + "px")
                .style("z-index", "2")
                .on("mouseover", function()
                {
                    var node = scene_graph.getNode(node_idx);

                    scene_graph.enableHighlightedParent(node);
                    scene_graph.enableHighlightedChildren(node);

                    d3.select(this).classed("over", true);
                })
                .on("mouseout", function()
                {
                    var node = scene_graph.getNode(node_idx);

                    scene_graph.disableHighlightedParent(node);
                    scene_graph.disableHighlightedChildren(node);

                    d3.select(this).classed("over", false);
                });

            node.view_menu.append('div').attr("class", "center")
                .append('i')
                .attr("idx", node_idx)
                .attr("leaf_idx", model.id)
                .attr("class", class_info.menu_download)
                .on("click", function(){ scope.onEventDownload(d3.select(this).attr("leaf_idx")) });

            node.view_menu.append('div').attr("class", "left")
                .append('i')
                .attr("idx", node_idx)
                .attr("leaf_idx", model.id)
                .attr("class", class_info.menu_remove)
                .on("click", function(){ scope.onEventRemoveLeaf(d3.select(this).attr("leaf_idx")) });

            node.view_menu.append('div').attr("class", "right")
                .append('i')
                .attr("idx", node_idx)
                .attr("class", class_info.menu_movable)
                .on("mousedown", function(){ scene_graph.enableDraggingMode(scene_graph.getNode(d3.select(this).attr("idx"))) });
        }
        else
        {
            node.view_menu.attr("class", class_info.menu)
                .attr("idx", node_idx)
                .style("left", this.view_center_x + node.x - node.width/2 + "px")
                .style("top", this.view_center_y + node.y - node.height/2 + "px")
                .style("z-index", "2")
                .on("mouseover", function()
                {
                    var node = scene_graph.getNode(node_idx);

                    scene_graph.enableHighlightedParent(node);
                    scene_graph.enableHighlightedChildren(node);

                    if(scene_graph.view_dragging_node)
                    {
                        timer = setTimeout(function()
                        {
                            node.attachChild(scene_graph.view_dragging_node);
                            //scene_graph.arrange();
                            scene_graph.arrangeChildren();
                        }, 250);
                    }
                    else
                        d3.select(this).classed("over", true);
                })
                .on("mouseout", function()
                {
                    var node = scene_graph.getNode(node_idx);

                    scene_graph.disableHighlightedParent(node);
                    scene_graph.disableHighlightedChildren(node);

                    clearTimeout(timer);

                    if(scene_graph.view_dragging_node && scene_graph.view_dragging_node.parent)
                    {
                        scene_graph.view_dragging_node.parent.detachChild(scene_graph.view_dragging_node);
                        scene_graph.arrangeChildren();
                    }
                    else
                        d3.select(this).classed("over", false);
                });

            var div_node_menu_left = node.view_menu.append('div').attr("class", "left");

            div_node_menu_left.append('div').append('i')
                .attr("idx", node_idx)
                .attr("class", class_info.menu_add)
                .on("click", function(){ scope.onEventAddPreliminary(d3.select(this).attr("idx")) });

            div_node_menu_left.append('div').append('i')
                .attr("idx", node_idx)
                .attr("class", class_info.menu_remove)
                .on("click", function(){ scope.onEventRemove(d3.select(this).attr("idx")) });

            var div_node_menu_right = node.view_menu.append('div').attr("class", "right");

            div_node_menu_right.append('div').append('i')
                .attr("idx", node_idx)
                .attr("class", class_info.menu_edit_name)
                .on("click", function(){ scene_graph.enableEditMode(scene_graph.getNode(d3.select(this).attr("idx"))) });

            if(node.type == 'root')
            {
                div_node_menu_right.append('div').append('i')
                    .attr("idx", node_idx)
                    .attr("class", class_info.menu_arrange)
                    .on("mousedown", function()
                    {
                        if(scene_graph.arrange_mode == 'horizontal')
                            scene_graph.arrange_mode = 'vertical';
                        else
                            scene_graph.arrange_mode = 'horizontal';

                        scene_graph.arrange();
                    });
            }
            else
            {
                div_node_menu_right.append('div').append('i')
                    .attr("idx", node_idx)
                    .attr("class", class_info.menu_movable)
                    .on("mousedown", function(){ scene_graph.enableDraggingMode(scene_graph.getNode(d3.select(this).attr("idx"))) });
            }


            node.view_menu.append('div').attr("class", "center")
                .append('i')
                .attr("idx", node_idx)
                .attr("class", class_info.menu_view)
                .on("click", function(){ scope.onEventView(d3.select(this).attr("idx")) });
        }


        // Link

        node.view_link = this.view_link.append("path")
            .attr("idx", node_idx)
            .attr("class", class_info.link)
            .attr("d", d3.svg.diagonal()
                .source({x : this.view_center_y - 50 + node.link_src_y, y : this.view_center_x + node.link_src_x})
                .target({x : this.view_center_y - 50 + node.link_dst_y, y : this.view_center_x + node.link_dst_x})
                .projection(function(d) { return [d.y, d.x]; }));
    },

    removeNode : function(node_idx)
    {
        var node = this.node_map[node_idx];

        if(node.children != null)
        {
            var children_clone = node.children.splice(0);

            for(var j = 0; j < children_clone.length; ++j)
                this.removeNode(this.getNodeIdxFromModel(children_clone[j].model));
        }

        this.disableEditMode(node);
        this.disableHighlightedParent(node);
        this.disableHighlightedChildren(node);

        if(node.parent)
            node.parent.detachChild(node);

        this.view_node.selectAll("div[idx='" + node_idx +"']").remove();
        this.view_link.selectAll("path[idx='" + node_idx +"']").remove();

        this.node_map[node_idx] = null;
    },

    arrange : function(duration)
    {
        if(this.arrange_mode == 'horizontal')
            arrangeHorizontal(this.node_root, false, 'balanced');
        else
            arrangeVertical(this.node_root, false, 'balanced');

        this.updateNodePosition(this.node_root, duration);
    },

    arrangeChildren : function(duration)
    {
        if(this.arrange_mode == 'horizontal')
            arrangeHorizontal(this.node_root, false, 'fixed');
        else
            arrangeVertical(this.node_root, false, 'fixed');

        this.updateNodePosition(this.node_root, duration);
    },

    updateNodeTransition : function(node, duration)
    {
        if(duration == null)
            duration = 250;

        node.view_transitioning = true;

        node.view_info
            .transition()
            .duration(duration)
            .each("end", function(){node.view_transitioning = false; node.view_positioning = false;})
            .style("left", this.view_center_x + node.x - node.width/2 + "px")
            .style("top", this.view_center_y + node.y - node.height/2 + "px")
            .style("background-color",  node.view_editing                                               ?   "#E9EA7A" :
                                        node.view_highlighted_parent == true    && node.type != 'root'  ?   "#957acb" :
                                        node.view_highlighted_children == true  && node.type != 'root'  ?   "#F0B449" :
                                        node.type == 'leaf'                                             ?   '#557CA2' :
                                        node.model.node_idx == node.model.root_idx                      ?   "#7FD6BA" :
                                                                                                            "#82cadd");

        node.view_menu
            .transition()
            .duration(duration)
            .each("end", function(){node.view_transitioning = false; node.view_positioning = false;})
            .style("left", this.view_center_x + node.x - node.width/2 + "px")
            .style("top", this.view_center_y + node.y - node.height/2 + "px");

        var diagonal;

        if(scene_graph.arrange_mode == 'horizontal')
        {
            diagonal = d3.svg.diagonal()
                .source({x : this.view_center_y - 50 + node.link_src_y, y : this.view_center_x + node.link_src_x})
                .target({x : this.view_center_y - 50 + node.link_dst_y, y : this.view_center_x + node.link_dst_x})
                .projection(function(d) { return [d.y, d.x]; });
        }
        else
        {
            diagonal = d3.svg.diagonal()
                .source({x : this.view_center_x + node.link_src_x, y : this.view_center_y - 50 + node.link_src_y})
                .target({x : this.view_center_x + node.link_dst_x, y : this.view_center_y - 50 + node.link_dst_y})
        }

        node.view_link
            .transition()
            .duration(duration)
            .each("end", function(){node.view_transitioning = false; node.view_positioning = false;})
            .attr("d", diagonal)
            .style("stroke-width",  node.view_editing                                               ?   "4px" :
                                    node.view_highlighted_parent == true    && node.type != 'root'  ?   "6px" :
                                    node.view_highlighted_children == true  && node.type != 'root'  ?   "4px" :
                                                                                                        "2px")
            .style("stroke",        node.view_editing                                               ?   "#D5D66B" :
                                    node.view_highlighted_parent == true    && node.type != 'root'  ?   "#957acb" :
                                    node.view_highlighted_children == true && node.type != 'root'  ?   "#F09446" :
                                    node.type == 'leaf'                                             ?   "#486B90" :
                                                                                                        "#5aa0b3");
    },

    updateNodePosition : function(node, duration)
    {
        if(node.type != 'null')
        {
            node.view_positioning = true;
            this.updateNodeTransition(node, duration);
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
                        //scope.onEventRemovePreliminary();
                        scene_graph.removeNode(-1);
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

    enableHighlightedParent : function(node, duration)
    {
        if(node == null || node.view_positioning == true || node.view_dragging == true)
            return;

        node.view_highlighted_parent = true;

        this.updateNodeTransition(node, duration);

        this.enableHighlightedParent(node.parent, duration);
    },

    disableHighlightedParent : function(node, duration)
    {
        if(node == null || node.view_positioning == true || node.view_dragging == true)
            return;

        node.view_highlighted_parent = false;

        this.updateNodeTransition(node, duration);

        this.disableHighlightedParent(node.parent, duration);
    },

    enableHighlightedChildren : function(node, duration)
    {
        if(node == null || node.view_positioning == true || node.view_dragging == true)
            return;

        node.view_highlighted_children = true;

        this.updateNodeTransition(node, duration);

        if(node.type == 'leaf')
            return;

        for(var i = 0; i < node.children.length; ++i)
            this.enableHighlightedChildren(node.children[i], duration);
    },

    disableHighlightedChildren : function(node, duration)
    {
        if(node == null || node.view_positioning == true || node.view_dragging == true)
            return;

        node.view_highlighted_children = false;

        this.updateNodeTransition(node, duration);

        if(node.type == 'leaf')
            return;

        for(var i = 0; i < node.children.length; ++i)
            this.disableHighlightedChildren(node.children[i], duration);
    },

    enableEditMode : function(node)
    {
        node.view_menu.style("visibility", "hidden");

        node.view_editing = true;
        this.updateNodeTransition(node);

        var node_clicked = false;

        node.view_name.on("mousedown.edit", function(){ node_clicked = true; });

        this.view_body.on("mousedown.edit", function()
        {
            if(node_clicked == false)
            {
                if(node.model.node_idx == -1)
                    scope.onEventRemovePreliminary();
                else
                    scene_graph.disableEditMode(node);
            }

            node_clicked = false;
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
        document.getElementById("input_" + node.model.node_idx).blur();

        node.view_editing = false;

        this.updateName(node);
        this.updateNodeTransition(node);

        node.view_menu.style("visibility", "visible");
        node.view_editing = false;
        node.view_name.on("mousedown.edit", null);
        this.view_body.on("mousedown.edit", null);
        this.view_body.on("keydown.edit", null);
    },

    enableDraggingMode : function(node)
    {
        this.disableHighlightedParent(node, 0);
        this.disableHighlightedChildren(node, 0);

        node.view_dragging = true;
        node.view_info.style("z-index", "0");
        node.view_menu.style("visibility", "hidden");
        node.updateDownward();

        this.view_dragging_node = node;
        this.view_dragging_node_parent = node.parent;

        node.parent.detachChild(node);

        node.link_src_x = node.link_dst_x = node.x;
        node.link_src_y = node.link_dst_y = node.y;

        if(scene_graph.arrange_mode == 'horizontal')
            arrangeHorizontal(node, true);
        else
            arrangeVertical(node, true);

        scene_graph.updateNodePosition(node, 0);

        scene_graph.arrangeChildren();

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

            if(scene_graph.arrange_mode == 'horizontal')
                arrangeHorizontal(node, true);
            else
                arrangeVertical(node, true);

            scene_graph.updateNodePosition(node, 0);
        });
    },

    disableDraggingMode : function(node)
    {
        this.view_body.on("mousemove.drag", null);
        this.view_body.on("mouseup.drag", null);

        node.view_dragging = false;
        node.view_info.style("z-index", "1");
        node.view_menu.style("visibility", "visible");
        node.updateDownward(false);

        if(this.view_dragging_node.parent)
        {
            var model = this.view_dragging_node.model;
            var parent_model = this.view_dragging_node.parent.model;

            if(node.type == 'leaf')
            {
                node_store.updateLeaf(model.id, parent_model.node_idx, function(leaf_model, leaf_list)
                {
                    var node_updated = scene_graph.getNode("leaf_" + leaf_model.id);

                    node_updated.model = leaf_model;

                    scene_graph.getParentNodeFromModel(leaf_model).attachChild(node_updated);
                    scene_graph.disableHighlightedParent(node, 0);
                    scene_graph.disableHighlightedChildren(node, 0);
                    scene_graph.arrange();
                });
            }
            else
            {
                node_store.updateNode(model.node_idx, parent_model.node_idx, model.name, model.due_date, model.description, model.assigned_users, function(node_idx, node_list)
                {
                    var node_updated = scene_graph.getNode(node_idx);
                    var model_updated = node_store.getNode(node_idx);

                    node_updated.model = model_updated;

                    scene_graph.getParentNodeFromModel(model_updated).attachChild(node_updated);
                    scene_graph.disableHighlightedParent(node, 0);
                    scene_graph.disableHighlightedChildren(node, 0);
                    scene_graph.arrange();
                });
            }
        }
        else
        {
            this.view_dragging_node_parent.attachChild(this.view_dragging_node);
            this.disableHighlightedParent(this.view_dragging_node, 0);
            this.disableHighlightedChildren(this.view_dragging_node, 0);
            this.arrange();
        }

        this.view_dragging_node = null;
        this.view_dragging_node_parent = null;
    },

    enableSwipingMode : function()
    {
        var started = false;
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
            if(pre_x == null && pre_y == null)
            {
                pre_x = d3.mouse(this)[0];
                pre_y = d3.mouse(this)[1];
            }
            else
            {
                var cur_x = d3.mouse(this)[0];
                var cur_y = d3.mouse(this)[1];
                var d_x = cur_x - pre_x;
                var d_y = cur_y - pre_y;

                if(Math.sqrt(d_x * d_x + d_y * d_y) > 50)
                    started = true;

                if(started)
                {
                    scene_graph.node_root.move(d_x, d_y);
                    scene_graph.updateNodePosition(scene_graph.node_root, 0);

                    pre_x = cur_x;
                    pre_y = cur_y;
                }
            }
        });
    },

    disableSwipingMode : function()
    {
        this.view_body.on("mouseup.swipe", null);
        this.view_body.on("mousemove.swipe", null);
    }
};
