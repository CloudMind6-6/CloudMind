AppendViewNode = function(controller, node)
{
    var scene_graph_node = scene_graph_node_map[node.idx];

    var node_info_div = controller.append('div');
    var node_menu_div = controller.append('div');
    var node_edit_div = controller.append('div');

    node_info_div_map[node.idx] = node_info_div;
    node_menu_div_map[node.idx] = node_menu_div;
    node_edit_div_map[node.idx] = node_edit_div;

    node_info_div.attr("class", "mindmap_node_info")
        .style("left", center_x - node_scene_graph_form.half_width  + scene_graph_node.x + "px")
        .style("top",  center_y - node_scene_graph_form.half_height + scene_graph_node.y + "px")
        .style("width", node_scene_graph_form.width + "px")
        .style("height", node_scene_graph_form.height + "px")
        .style("border-radius", node_scene_graph_form.height / 10 + "px")

    var node_div_label_container = node_info_div.append('ul').attr("class", "nav navbar-nav");

    for(var j = 0; j < node.labels.length; ++j)
    {
        var label = node.labels[j];

        node_div_label_container.append('li')
            .attr("class", "mindmap_label")
            .style("background-color", label_palette[label].color);
    }

    node_info_div.append('div')
        .attr("class", "description")
        .text(node.name);

    var node_div_assigned_container = node_info_div.append('div')
        .attr("class", "assigned");

    for(var j = 0; j < node.assigned_users.length; ++j)
    {
        var label = node.assigned_users[j];

        node_div_assigned_container.append('img')
            .attr("ng-src", "img/a1.jpg")
            .attr("width", "10px")
            .attr("height", "10px")
            .style("margin-left", "1px")
    }


    node_menu_div.attr("class", "mindmap_node_menu")
        .style("left", center_x - node_scene_graph_form.half_width  + scene_graph_node.x + "px")
        .style("top",  center_y - node_scene_graph_form.half_height + scene_graph_node.y + "px")
        .style("width", node_scene_graph_form.width + "px")
        .style("height", node_scene_graph_form.height + "px")
        .style("border-radius", node_scene_graph_form.height / 10 + "px")
        /*
         .on("mouseover", function(){d3.select(this).style("visibility", "visible");})
         .on("mouseout", function(){d3.select(this).style("visibility", "hidden");})
         */
        .on("mouseover", function(){d3.select(this).classed("over", true);})
        .on("mouseout", function(){d3.select(this).classed("over", false);})


    var node_menu_side_div = node_menu_div.append('div').attr("class", "left");

    node_menu_side_div.append('div').append('i').attr("class", "fa fa-lg fa-plus-square")
    node_menu_side_div.append('div').append('i').attr("class", "fa fa-lg fa-trash-o")

    node_menu_div.append('div')
        .attr("class", "right")
        .append('i')
        .attr("class", "fa fa-2x fa-file-text");

    node_edit_div.attr("class", "mindmap_node_edit")
        .style("left", center_x - node_scene_graph_form.half_width * 3  + scene_graph_node.x + "px")
        .style("top",  center_y - node_scene_graph_form.half_height * 3 + scene_graph_node.y + "px")
        .style("width", node_scene_graph_form.width * 3 + "px")
        .style("height", node_scene_graph_form.height * 3 + "px")
        .style("border-radius", node_scene_graph_form.height * 3 / 10 + "px")
}

AppendViewLink = function(container, link)
{
    var canvas_absolute_y = 50;

    var diagonal = d3.svg.diagonal()
        .source({x:link.src_y + center_y - canvas_absolute_y, y:link.src_x + center_x})
        .target({x:link.dst_y + center_y - canvas_absolute_y, y:link.dst_x + center_x})
        .projection(function(d) { return [d.y, d.x]; });

    //node_link_map[]

    container.append("path")
        .attr("class", link)
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("d", diagonal);
}