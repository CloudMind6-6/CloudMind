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

    {idx:9, parent_idx:4, root_idx:1, name:"node9", desc:"FAWEFAWEFAWG", assigned_users:[1001, 1002, 1003], labels:[0,7], due_date:"2015-11-19"},
    {idx:10, parent_idx:4, root_idx:1, name:"node10", desc:"FAWEFAWEFAWG", assigned_users:[1001, 1002, 1003], labels:[6,7,1], due_date:"2015-11-19"},
    {idx:11, parent_idx:4, root_idx:1, name:"node11", desc:"45345", assigned_users:[1001, 1002, 1003], labels:[2,3,0], due_date:"2015-11-19"},

    {idx:12, parent_idx:7, root_idx:1, name:"node12", desc:"FAWEFAWEFAWG", assigned_users:[1001, 1002, 1003], labels:[5,1,3], due_date:"2015-11-19"},
    {idx:13, parent_idx:7, root_idx:1, name:"node13", desc:"FAWEFAWEFAWG", assigned_users:[1001, 1002, 1003], labels:[0,7], due_date:"2015-11-19"},
    {idx:14, parent_idx:7, root_idx:1, name:"node14", desc:"FAWEFAWEFAWG", assigned_users:[1001, 1002, 1003], labels:[2,3,1], due_date:"2015-11-19"},

    {idx:15, parent_idx:10, root_idx:1, name:"node15", desc:"FAWEFAWEFAWG", assigned_users:[1001, 1002, 1003], labels:[0,7,6], due_date:"2015-11-19"},

    {idx:16, parent_idx:6, root_idx:1, name:"node16", desc:"FAWEFAWEFAWG", assigned_users:[1001, 1002, 1003], labels:[0,7], due_date:"2015-11-19"},
    {idx:17, parent_idx:6, root_idx:1, name:"node17", desc:"FAWEFAWEFAWG", assigned_users:[1001, 1002, 1003], labels:[0,7], due_date:"2015-11-19"},
    {idx:18, parent_idx:6, root_idx:1, name:"node18", desc:"FAWEFAWEFAWG", assigned_users:[1001, 1002, 1003], labels:[0,7], due_date:"2015-11-19"},

    {idx:19, parent_idx:8, root_idx:1, name:"node19", desc:"FAWEFAWEFAWG", assigned_users:[1001, 1002, 1003], labels:[0,7], due_date:"2015-11-19"},

    {idx:20, parent_idx:11, root_idx:1, name:"node20", desc:"FAWEFAWEFAWG", assigned_users:[1001, 1002, 1003], labels:[0,7], due_date:"2015-11-19"},
    {idx:21, parent_idx:11, root_idx:1, name:"node21", desc:"FAWEFAWEFAWG", assigned_users:[1001, 1002, 1003], labels:[0,7], due_date:"2015-11-19"},
    {idx:22, parent_idx:11, root_idx:1, name:"node22", desc:"FAWEFAWEFAWG", assigned_users:[1001, 1002, 1003], labels:[0,7], due_date:"2015-11-19"},
    {idx:23, parent_idx:11, root_idx:1, name:"node23", desc:"FAWEFAWEFAWG", assigned_users:[1001, 1002, 1003], labels:[0,7], due_date:"2015-11-19"},
];

var NodeStore = null;