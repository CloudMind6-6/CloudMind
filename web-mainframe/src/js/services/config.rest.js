
app.service('HttpSvc',[ '$http', function($http){

    var urlBase = '/rest/1.0/node';

    return {
        getNodes : function (_root) {
        return $http.get(urlBase + '/list', _root)
        },
        addNode :function () {
        return $http.get('/rest/1.0/node/list')
        }
}
}])