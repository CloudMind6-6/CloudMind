
app.service('UserStore', ['HttpSvc', function(HttpSvc){

    var selectedRootIdx;
    var userList;

    return{
        setUserList : function(_userList, _selectedRootIdx){
            userList = _userList;
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
        },

        addUserToRoot : function() {
            //유저가 수락한 경우 웹소켓 받으면 처리하는 함수
            // userList에만 추가하면 됨
        }
    }

}]);