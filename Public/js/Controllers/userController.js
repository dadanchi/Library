const userController = (() => {

    class UserController {

        addBook(params) {
            let id = +params.id.substr(1);
            let user = firebase.auth().currentUser;
            if (user != null) {
                data.getOneBook(id).then(book => {
                    let bookName = book.name;
                    firebase.database().ref("Library/Users").once("value").then(snapshot => {
                        snapshot.forEach(s => {
                            if (s.val().username === user.displayName) {
                                firebase.database().ref("Library/Users/" + s.val().key + "/Books/" + book.id).set(book);
                                toastr.success("Successfully added the book");
                            }
                        });
                    });
                });
            } else {
                toastr.error("You need to be logged to add");
            }
        }

        removeBook(params) {
            let id = +params.id.substr(1);
            let auth = firebase.auth().currentUser;
            if (auth != null) {
                let user;
                firebase.database().ref("Library/Users").once("value").then(snapshot => {
                    snapshot.forEach(s => {
                        if (s.val().username === auth.displayName) {
                            user = s.val();
                        }
                    });
                    let userBooks = firebase.database().ref("Library/Users/" + user.key + "/Books").once("value").then(snapshot => {
                        let isFound = false;
                        snapshot.forEach(s => {
                            if (s.val().id === id) {
                                isFound = true;
                                // remove
                                firebase.database()
                                    .ref("Library/Users/" + user.key + "/Books/" + id)
                                    .remove()
                                    .then(() => {
                                        toastr.success("Book successfully removed!");
                                    });
                            }
                        });
                        if (!isFound) {
                            toastr.error("You haven't added this book to remove it");
                        }
                    });
                });


            } else {
                toastr.error("You need to be logged to add");
            }
        }

        getMyBooks() {
            let auth = firebase.auth().currentUser;
            if (auth != null) {
                let user;

                firebase.database().ref("Library/Users").once("value").then(users => {
                    users.forEach(u => {
                        if (u.val().username === auth.displayName) {
                            user = u.val();
                        }
                    });

                    let userBooks = [];
                    Promise.all([
                        firebase.database().ref("Library/Users/" + user.key + "/Books").once("value").then(books => {
                            books.forEach(b => {
                                userBooks.push(b.val());
                            });
                            return userBooks;
                        }),
                        loadTemplate("userBooks")
                    ]).then(([books, template]) => {
                        $("#app-container").html(template(books));
                    });
                });
            } else {
                toastr.error("You need to be logged to add");
            }
        }

        load() {
            loadTemplate("signUp").then(template => {
                $("#app-container").html(template);
            })
        }

        signUp() {

            let dbReference = firebase.database();

            let email = $('#email-input').val();
            let username = $('#username-input').val();

            let password = $('#password-input').val();
            let USER_AUTH_KEY = "";

            return firebase.auth().createUserWithEmailAndPassword(email, password).then(function(user) {
                user.updateProfile({
                    displayName: username,
                    isAnonymous: false,
                });

                data.createNewUserDataBase(password, username);

                USER_AUTH_KEY = user.uid;

                localStorage.setItem('username', username);
                localStorage.setItem('auth-key', USER_AUTH_KEY);

                notifier.success('everything went fine');
                setTimeout(() => homeController.loadRegedUserView(), 500);
                $('#auth-btn').addClass('hidden');
                $('#logout-btn').removeClass('hidden');
            }).catch(function(error) {

                var errorCode = error.code;
                var errorMessage = error.message;
                notifier.error(errorCode + ' - ' + errorMessage)
            });

        }

        logout() {
            localStorage.clear();
            notifier.info('You logged out successfully!');
            location.hash = '#/home';
            homeController.load('home');
            $('#auth-btn').removeClass('hidden');
            $('#logout-btn').addClass('hidden');
            location.hash = '#/home';
        }

        signIn() {
            let email = $('#email-input').val();
            let password = $('#password-input').val();
            let username = $('#username-input').val();
            const auth = firebase.auth();
            let USER_AUTH_KEY = '';

            auth.signInWithEmailAndPassword(email, password).then(function(user) {

                    USER_AUTH_KEY = user.uid;

                    localStorage.setItem('username', user.displayName);
                    localStorage.setItem('auth-key', USER_AUTH_KEY);

                    notifier.success(`${username} signed in!`);
                    setTimeout(() => homeController.loadRegedUserView(), 500);
                    $('#auth-btn').addClass('hidden');
                    $('#logout-btn').removeClass('hidden');

                })
                .catch(function() {
                    notifier.error('Wrong email / password / username');
                    location.hash = '#/auth';
                    return;
                })


            auth.onAuthStateChanged(function(user) {
                if (user) {
                    // add functionality

                }
            });

            // let currentUser = auth.currentUser;
            // console.log('cntrl ' + currentUser.email);
            // console.log('cntrl ' + currentUser.displayName);
            // let newUser = new User(username, password);
            // newUser = currentUser;
            // newUser.doSomething();
        }
    }

    let usrCntrl = new UserController();
    return usrCntrl;
})();


























//  CODE BEFORE SIGNIN PUSH
// const userController = (() => {

//     const getNextId = (function () {
//         let counter = 0;
//         return function () {
//             counter += 1;
//             return counter;
//         };
//     })();

//     class UserController {

//         load() {
//             loadTemplate("signUp").then(template => {
//                 $("#app-container").html(template);
//             })
//         }

//         signUp() {

//             let dbReference = firebase.database();

//             let username = $('#username-input').val();
//             // if(!validator.isValidUserName(username)){
//             //     notifier.error('Invalid username');
//             //     $('#username-input').val('');
//             //     location.hash = '#auth';               
//             //     return;
//             // }

//             let password = $('#password-input').val();

//             let newUser = new User(username, password);

//             // Check if username is taken, then continue
//             let result = validator.usernameIsTaken(username).then((resp) => {
//                 if (resp) {
//                     notifier.error('Username already taken!');
//                     location.hash = "#/auth";
//                     return;
//                 }

//                 $('#username-input').val('');

//                 let userReference = dbReference.ref('Library/Users');
//                 let newUserReference = userReference.push();

//                 let key = userReference.push().key;

//                 newUserReference.set({
//                     password: newUser.passHash,
//                     username: newUser.username,
//                     key: key,
//                     books: newUser.books,
//                 });

//                 notifier.successfullRegistrationMsg('You have registered successfully!');             
//                 setTimeout(() => homeController.loadRegedUserView(), 500);
//                 $('#initial-header').addClass('hidden');
//             });
//         }

//         logout(){
//             localStorage.clear();
//             notifier.info('You logged out successfully!');
//             location.hash = '#/home';
//             homeController.load('home');
//             $('#initial-header').removeClass('hidden');                     
//             location.hash = '#/home';
//         }
//     }

//     let usrCntrl = new UserController();
//     return usrCntrl;
// })();