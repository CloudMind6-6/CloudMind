app.service('HttpSvc', ['$http', function ($http) { /* resource api 수정해야함 */

        var urlBase = '/rest/1.0';

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
                    data: {email: _email}
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
                    data: {
                        root_idx: _root_idx,
                        email: _email
                    }
                });
            },

            /* NODE REST API */
            getNodes: function (_root_idx) {
                return $http({
                    url: urlBase + '/node/list',
                    method: "GET",
                    data: {root_idx: _root_idx}
                });
            },

            addNode: function (_nodename, _node_parent_idx) {
                return $http({
                    url: urlBase + '/node/add',
                    method: "POST",
                    data: {
                        nodename: _nodename,
                        node_parent_idx: _node_parent_idx
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

            updateNode: function (_node_idx, _assignedUser, _dueDate, _nodename) {
                return $http({
                    url: urlBase + '/node/update',
                    method: "POST",
                    data: {
                        node_idx: _node_idx,
                        AssignedUser: _assignedUser,
                        DueDate: _dueDate,
                        Nodename: _nodename
                    }
                });
            },

            /* LABEL PALETTE REST API */

            getLabelpalettes: function (_root_idx) {
                return $http({
                    url: urlBase + '/label_palette/list',
                    method: "GET",
                    data: {root_idx: _root_idx}
                });
            },

            addLabelpalette: function (_root_idx, _name, _color) {
                return $http({
                    url: urlBase + '/label_palette/add',
                    method: "POST",
                    data: {
                        root_idx: _root_idx,
                        name: _name,
                        color: _color
                    }
                });
            },

            removeLabelpalette: function (_palette_number) {
                return $http({
                    url: urlBase + '/label_palette/remove',
                    method: "POST",
                    data: {palette_number: _palette_number}
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
            addLabel: function (_node_idx, _palette_number) {
                return $http({
                    url: urlBase + '/label/add',
                    method: "POST",
                    data: {
                        node_idx: _node_idx,
                        palette_number: _palette_number
                    }
                });
            },

            removeLabel: function (_node_idx, _palette_number) {
                return $http({
                    url: urlBase + '/label/remove',
                    method: "POST",
                    data: {
                        node_idx: _node_idx,
                        palette_number: _palette_number
                    }
                });
            }
        }
    }]

    /* RESOURCE REST API */
);