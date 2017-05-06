const userController = (() => {

    const getNextId = (function () {
        let counter = 0;
        return function () {
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

            
            
            let newUser = new User(username, password);

            // Check if username is taken, then continue
            let result = validator.usernameIsTaken(username).then((resp) => {
                if (resp) {
                    notifier.error('Username already taken!');
                    location.hash = "#/auth";
                    return;
                }

                $('#username-input').val('');

                // validator.isValidPassword(password).then((resp) => {
                //     if (resp) {
                //         notifier.error('Invalid password : must be at least six characters');
                //         location.hash = '#auth';
                //         return;
                //     }

                //     //$('#password-input').val('');

                // })

                let userReference = dbReference.ref('Library/Users');
                let newUserReference = userReference.push();

                let key = userReference.push().key;

                newUserReference.set({
                    password: newUser.passHash,
                    username: newUser.username,
                    key: key,
                    books: newUser.books,
                });

                notifier.successfullRegistrationMsg('You have registered successfully!');
                setTimeout(() => homeController.loadRegedUserView(), 2500);
            });
        }
    }

    let usrCntrl = new UserController();
    return usrCntrl;
})();