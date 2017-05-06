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

            // let dbReference = firebase.database();
            // let username = $('#username-input').val();
            // let password = $('#password-input').val();
            // let userId = getNextId();

            // dbReference.ref('Library/Users/' + 4).set({
            //     password: password,
            //     username: username
            // });

            let dbReference = firebase.database();
            let username = $('#username-input').val();
             let password = $('#password-input').val();

             let userReference = dbReference.ref('Library/Users');
             let newUserReference = userReference.push();
             let key = userReference.push().key;

             newUserReference.set({
                 password: password,
                 username : username,
                 key : key
             });

        }


    }

    let usrCntrl = new UserController();
    return usrCntrl;
})();