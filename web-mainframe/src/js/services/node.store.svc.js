
app.service('NodeStore', function(){
    var nodeList = {};

    return {
        setNodeList : function (_nodeList) {
        nodeList = _nodeList;
        },
        getNodeList : function () {
        return nodeList;
        }
    };
});