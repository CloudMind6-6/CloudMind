
app.service('UserStore', ['HttpSvc', function(HttpSvc){

    var selectedRootIdx;
    var userList;

    return{
        setUserList : function(_userList, _selectedRootIdx){

            userList = new Object();

            for(var i in _userList){
                var idx = _userList[i].account_id;
                userList[idx] = _userList[i];
            }
            selectedRootIdx = _selectedRootIdx;
        },

        syncUserList : function(){
            return userList;
        },

        inviteUserToRoot : function(_rootIdx, _email){
            HttpSvc.inviteRoot(_rootIdx, _email)
                .success(function (res){
                    if(! res.success) throw new Error;
                })
                .error(function (err){
                    console.log(err);
                });
        }
    }


}]);