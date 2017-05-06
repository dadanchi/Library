const userController = (() => {

    const getNextId = (function() {
    let counter = 0;
    return function() {
        counter += 1;
        return counter;
    };
})();

    class UserController {

        

        load() {
            loadTemplate("signUp").then(template => {
                $("#app-container").html(template);
            })
        }

        signUp() {
            let dbReference = firebase.database();
            let username = $('#username-input').val();
            let password = $('#password-input').val();
            let userId = getNextId();

            dbReference.ref('Library/Users/' + userId).set({
                password: password,
                username: username
            });

        }


    }

    let usrCntrl = new UserController();
    return usrCntrl;
})();