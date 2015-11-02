
app.service('UserStore', ['HttpSvc', function($http){

    var selectedIdx;
    var userList;

    return{
        setSelectedIdx : function(_idx){
            selectedIdx = _idx;
        },

        setUserList : function(_userList){
            userList = _userList;
        },

        getUerList : function(){
            return userList[selectedIdx];
        }
    }

}]);