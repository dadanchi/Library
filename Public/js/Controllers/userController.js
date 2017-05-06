const userController = (() => {
    
    class UserController{

    signUp(){
    let dbReference = firebase.database();
    let username = $('#username-input').val();
    let password = $('#password-input').val();
    let userId = getNextId();

    dbReference.ref('Library/Users/' + userId).set({
        password :password,
        username : username
    });

};
    }

    let usrCntrl = new UserController();
    return usrCntrl;
})();