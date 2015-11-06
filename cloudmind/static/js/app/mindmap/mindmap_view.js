
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
    this.node_spanning_odd = true;
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
        child.node_spanning_odd = this.node_spanning_odd;

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

    arrangeHorizontal : function()
    {
        var child_current_pos = 0;

        for(var i = 0; i < this.children.length; ++i)
        {
            var child = this.children[i];

            child.y = this.y - (this.height/2) + child_current_pos + (child.height/2);

            if(this.node_spanning_odd)
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

SceneGraphView = function()
{
    this.body        = d3.select("body");
    this.canvas_node = this.body.select("div[ng-controller='MindmapCtrl']");
    this.canvas_link = this.canvas_node.select("svg");
    this.center_x    = screen.width  / 2;
    this.center_y    = screen.height / 2 - 40;
}

SceneGraphView.prototype =
{
    appendNode : function(node)
    {
        var model = node.model;

        var div_node_info = this.canvas_node.append('div');
        var div_node_menu = this.canvas_node.append('div');
        var div_node_edit = this.canvas_node.append('div');

        div_node_info.attr("class", "mindmap_node_info")
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


        div_node_menu.attr("class", "mindmap_node_menu")
            .style("left", this.center_x - scene_graph_form.half_width  + scene_graph_node.x + "px")
            .style("top",  this.center_y - scene_graph_form.half_height + scene_graph_node.y + "px")
            .style("width", scene_graph_form.width + "px")
            .style("height", scene_graph_form.height + "px")
            .style("border-radius", scene_graph_form.height / 10 + "px")
            /*
             .on("mouseover", function(){d3.select(this).style("visibility", "visible");})
             .on("mouseout", function(){d3.select(this).style("visibility", "hidden");})
             */
            .on("mouseover", function(){d3.select(this).classed("over", true);})
            .on("mouseout", function(){d3.select(this).classed("over", false);})


        var div_node_menu_side = div_node_menu.append('div').attr("class", "left");

        div_node_menu_side.append('div').append('i').attr("class", "fa fa-lg fa-plus-square")
        div_node_menu_side.append('div').append('i').attr("class", "fa fa-lg fa-trash-o")

        div_node_menu.append('div')
            .attr("class", "right")
            .append('i')
            .attr("class", "fa fa-2x fa-file-text");



        div_node_edit.attr("class", "mindmap_node_edit")
            .style("left", this.center_x - scene_graph_form.half_width * 3  + scene_graph_node.x + "px")
            .style("top",  this.center_y - scene_graph_form.half_height * 3 + scene_graph_node.y + "px")
            .style("width", scene_graph_form.width * 3 + "px")
            .style("height", scene_graph_form.height * 3 + "px")
            .style("border-radius", scene_graph_form.height * 3 / 10 + "px")



        var diagonal = d3.svg.diagonal()
            .source({x : this.center_y - 50 + node.link_src_y, y : this.center_x + node.link_src_x})
            .target({x : this.center_y - 50 + node.link_dst_y, y : this.center_x + node.link_dst_x})
            .projection(function(d) { return [d.y, d.x]; });

        this.canvas_link.append("path")
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("d", diagonal);
    },
}