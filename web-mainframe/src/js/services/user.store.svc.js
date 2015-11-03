
app.service('UserStore', ['HttpSvc', function(HttpSvc){

    var selectedIdx;
    var selectedRootIdx;
    var userList;

    return{
        setSelectedIdx : function(_idx, _selectedRootIdx){
            selectedIdx = _idx;
            selectedRootIdx = _selectedRootIdx;
        },

        setUserList : function(_userList){
            userList = _userList;
        },

        syncUserList : function(){
            return userList[selectedIdx];
        },

        inviteUserToRoot : function(_rootIdx, _email){
            HttpSvc.inviteRoot(_rootIdx, _email)
                .success(function (res){
                    if(! res.success) throw new Error;
                })
                .error(function (err){
                    console.log('err');
                    // 다이얼로그(에러모듈) 처리
                });
        },

        addUserToRoot : function() {
            //유저가 수락한 경우 웹소켓 받으면 처리하는 함수
            // 유저가 작업하고 userList에만 추가하면 됨
        }
    }

}]);