app.service('HttpSvc', ['$http', function ($http) { /* resource api 수정해야함 */

        var urlBase = '/api/v1';

        return {

            /* OAUTH REST API */

            /* PROFILE REST API */
            getProfile: function () {
                return $http({
                    url: urlBase + '/profile',
                    method: "GET"
                });
            },

            updateName: function (_name) {
                return $http({
                    url: urlBase + '/profile/update_name',
                    method: "POST",
                    data: {name: _name}
                });
            },

            updatePic: function (_user_picture) {
                return $http({
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    url: urlBase + '/profile/update_picture',
                    method: "POST",
                    data: {user_picture: _user_picture}
                });
            },

            searchProfile: function (_email) {
                return $http({
                    url: urlBase + '/profile/search',
                    method: "GET",
                    params: {email: _email}
                });
            },

            /* ROOT REST API*/
            getRoots: function () {
                return $http({
                    url: urlBase + '/root/list',
                    method: "GET"
                });
            },
            inviteRoot: function (_root_idx, _email) {
                return $http({
                    url: urlBase + '/root/invite',
                    method: "GET",
                    params: {
                        root_idx: _root_idx,
                        email: _email
                    }
                });
            },

            /* NODE REST API */
            getNodes: function (_root_id) {
                return $http({
                    url: urlBase + '/node/list',
                    method: "GET",
                    params: {root_id: _root_id}
                });
            },

            addNode: function (_node_name, _node_parent_idx, _root_idx) {
                return $http({
                    url: urlBase + '/node/add',
                    method: "POST",
                    data: {
                        node_name: _node_name,
                        node_parent_idx: _node_parent_idx,
                        root_idx: _root_idx
                    }
                });
            },

            removeNode: function (_node_idx) {
                return $http({
                    url: urlBase + '/node/remove',
                    method: "POST",
                    data: {node_idx: _node_idx}
                });
            },

            updateNode: function (_idx, _node_name, _dueDate, _description) {
                return $http({
                    url: urlBase + '/node/update',
                    method: "POST",
                    data: {
                        id: _idx,
                        node_name: _node_name,
                        description: _description,
                        due_date: _dueDate
                    }
                });
            },

            /* LABEL PALETTE REST API */

            getLabelpalettes: function (_root_id) {
                return $http({
                    url: urlBase + '/label_palette/list',
                    method: "GET",
                    params: {root_id: _root_id}
                });
            },

            addLabelpalette: function (_root_id, _name, _color) {
                return $http({
                    url: urlBase + '/label_palette/add',
                    method: "POST",
                    data: {
                        root_id: _root_id,
                        name: _name,
                        color: _color
                    }
                });
            },

            removeLabelpalette: function (_palette_id) {
                return $http({
                    url: urlBase + '/label_palette/remove',
                    method: "POST",
                    data: {id: _palette_id}
                });
            },

            updateLabelpalette: function (_palette_number, _name, _color) {
                return $http({
                    url: urlBase + '/label_palette/update',
                    method: "POST",
                    data: {
                        palette_number: _palette_number,
                        name: _name,
                        color: _color
                    }
                });
            },

            /* LABEL REST API */
            addLabel: function (_node_id, _palette_id) {
                return $http({
                    url: urlBase + '/label/add',
                    method: "POST",
                    data: {
                        node_id: _node_id,
                        palette_id: _palette_id
                    }
                });
            },

            removeLabel: function (_node_id, _palette_id) {
                return $http({
                    url: urlBase + '/label/remove',
                    method: "POST",
                    data: {
                        node_id: _node_id,
                        palette_id: _palette_id
                    }
                });
            }
        }
    }]

    /* RESOURCE REST API */
);