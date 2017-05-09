//data.js

const data = (() => {
    class Data {
        getBooks() {
            return firebase.database().ref("Library/Books").once("value").then(snapshot => {
                let books = snapshot.val();

                return books;
            });
        }

        getOneBook(id) {
            return this.getBooks().then(books => {
                for (let i in books) {
                    if (books[i].id === id) {
                        return books[i];
                    }
                }
            });
        }

        getCategories() {
            return this.getBooks().then(books => {
                let categories = [];
                let resultCategories = [];
                let i = 0;

                books.forEach(b => {
                    if (!categories.hasOwnProperty(b.category)) {
                        categories[b.category] = {
                            name: b.category,
                            key: i
                        };

                        i++
                        resultCategories.push({
                            name: b.category,
                            books: []
                        });
                    }

                    let currentIndex = categories[b.category].key;
                    resultCategories[currentIndex].books.push(b);
                });

                this.sortByName(resultCategories);

                for (let i in resultCategories) {
                    this.sortByName(resultCategories[i].books);
                }

                return resultCategories;
            });
        }

        getOneCategory(name) {
            return this.getCategories().then(categories => {
                for (let i in categories) {
                    if (categories[i].name === name) {
                        return categories[i];
                    }
                }
            });
        }

        sortByName(array) {
            return array.sort((a, b) => {
                let name1 = a.name.replace(/\s+/g, '').toLowerCase();
                let name2 = b.name.replace(/\s+/g, '').toLowerCase();

                if (name1 > name2) {
                    return 1;
                } else if (name1 > name2) {
                    return -1;
                }

                return 0;
            });
        }

        createNewUserDataBase(password, username) {
            console.log('dosmth called');
            let btn = $('#user-button');

            let dbReference = firebase.database();
            let userReference = dbReference.ref('Library/Users');
            let newUserReference = userReference.push();

            let key = newUserReference.key;

            newUserReference.set({
                password: password,
                username: username,
                //books: books,
                key: key,
            });
        }

        signInUpAct(username) {
            notifier.success(`Welcome ${username}`);
            setTimeout(() => homeController.load(), 500);
            $("#auth-btn").addClass("hidden");
            $("#logout-btn").removeClass("hidden");
        }
    };

    let data = new Data();
    return data;
})();

//validator.js
const validator = (() => {
    const MIN_NAME_SYMBOLS = 3,
        MAX_SYMBOLS = 15,
        MIN_PASSWORD_SYMBOLS = 6,
        VALID_SYMBOLS = /^A-Za-z/;

    class Validator {
        isValidString(str) {
            if (!str || typeof str !== "string") {
                notifier.wrongUserNameMsg();
                return false;
            }
            if (str.trim().length === 0) {
                notifier.wrongUserNameMsg();
                return false;
            }
            return true;
        }

        isValidUserName(username) {
            if (username.length < MIN_NAME_SYMBOLS || username.length > MAX_SYMBOLS) {
                notifier.wrongUserNameMsg();
                return false;
            }
            if (username.match(VALID_SYMBOLS)) {
                notifier.wrongUserNameMsg();
                return false;
            }

            return true;
        }

        isValidPassword(password) {
            if (password.length < MIN_PASSWORD_SYMBOLS) {
                notifier.wrongPasswordMsg();
                return false;
            }

            if (password.length > MAX_SYMBOLS) {
                notifier.wrongPasswordMsg();
                return false;
            }
            return true;
        }

        usernameIsTaken(username) {
            return firebase.database().ref("Library/Users/").once("value").then(snapshot => {
                let result = false;
                snapshot.forEach(u => {
                    if (u.val().username === username) {
                        result = true;
                    }
                });

                return result;
            });
        }
    }

    let validator = new Validator();
    return validator;
})();

//Controllers
//homeController.js

const homeController = (() => {
    class HomeController {
        load() {
            return loadTemplate("home").then(template => {
                $("#app-container").html(template);
            })
        };

        loadCategoryDropDownMenu() {
            const $dropDownButton = $(".dropdown-toggle");

            data.getCategories().then(categories =>
                $dropDownButton.on("click", () => {
                    loadTemplate("dropDownCategory")
                        .then((template) => {
                            $dropDownButton.parent().html(template(categories));
                        });
                }));
        }
    }
    let homeController = new HomeController();

    return homeController;
})();

//userController.js
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
                Promise.resolve(firebase.database().ref("Library/Users").once("value").then(snapshot => {
                    snapshot.forEach(s => {
                        if (s.val().username === auth.displayName) {
                            user = s.val();
                        }
                    });
                    return user;
                })).then(user => {
                    let userBooks = firebase.database().ref("Library/Users/" + user.key + "/Books").once("value").then(snapshot => {
                        let isFound = false;
                        snapshot.forEach(s => {
                            if (s.val().id === id) {
                                isFound = true;

                                // remove the found book
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
                toastr.error("You need to be logged to remove");
            }
        }

        getMyBooks() {
            let auth = firebase.auth().currentUser;
            if (auth != null) {
                let user;

                return Promise.resolve(firebase.database().ref("Library/Users").once("value").then(users => {
                    users.forEach(u => {
                        if (u.val().username === auth.displayName) {
                            user = u.val();
                        }
                    });
                    return user;
                })).then(user => {
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
            if (!validator.isValidUserName(username) || !validator.isValidString(username)) {
                $('#username-input').val('');
                location.hash = '#/auth';
                return;
            }


            let password = $('#password-input').val();
            if(!validator.isValidPassword(password)){
                $('#password-input').val('');
                location.hash = '#/auth';
                return;
            }


            let USER_AUTH_KEY = "";
            let newUser = new User(username, password);


            Promise.resolve(validator.usernameIsTaken(username)).then(result => {
                console.log(result);
                if (!result) {
                    return firebase.auth().createUserWithEmailAndPassword(email, newUser.passHash).then(function(user) {
                        user.updateProfile({
                            displayName: username,
                            isAnonymous: false,
                        });

                        data.createNewUserDataBase(newUser.passHash, username);

                        USER_AUTH_KEY = user.uid;

                        localStorage.setItem("username", username);
                        localStorage.setItem("auth-key", USER_AUTH_KEY);

                        data.signInUpAct(username);

                        $(".nav.navbar-nav").append('<li><a href="#/user/books/all" id="my-books">My books</a></li>');
                    }).catch(function(error) {

                        var errorCode = error.code;
                        var errorMessage = error.message;
                        notifier.error(errorCode + ' - ' + errorMessage)

                    })
                } else {
                    toastr.error("Username is taken");
                }
            })
        }

        logout() {
            firebase.auth().signOut().then(() => {
                localStorage.clear();
            }).catch((error) => {
                notifier.error("Problems with signing out");
                location.hash = "#/auth";
                return;
            });
            homeController.load().then(() => {
                $("#auth-btn").removeClass("hidden");
                $("#logout-btn").addClass("hidden");
                $("#my-books").remove();
            });
        }

        signIn() {
            let email = $('#email-input').val();
            let password = $('#password-input').val();
            let username = $('#username-input').val();
            const auth = firebase.auth();
            let USER_AUTH_KEY = "";

            let newUser = new User(username, password);



            auth.signInWithEmailAndPassword(email, newUser.passHash).then(function(user) {

                USER_AUTH_KEY = user.uid;

                localStorage.setItem("username", user.displayName);
                localStorage.setItem("auth-key", USER_AUTH_KEY);

                data.signInUpAct(username);

                $(".nav.navbar-nav").append('<li><a href="#/user/books/all" id="my-books">My books</a></li>');
            })
                .catch(function() {
                    notifier.error("Wrong email / password / username");
                    location.hash = "#/auth";
                    return;
                })


            auth.onAuthStateChanged(function(user) {
                if (user) {
                    // add functionality

                }
            });
        }
    }

    let usrCntrl = new UserController();
    return usrCntrl;
})();

//contactsController.js
const contactsController = (() => {
    class ContactsController {
        load() {
            loadTemplate("contacts").then(template => {
                $("#app-container").html(template);
            })
        };
    }
    let contactsCtrl = new ContactsController();

    return contactsCtrl;
})();

//categoryController.js
const categoryController = (() => {

    class CategoryController {
        load(params) {
            let name = params.name.substr(1);
            Promise.all([
                loadTemplate("category"),
                data.getOneCategory(name),
            ])
                .then(([template, category]) => {
                    $("#app-container").html(template(category));
                })
        }

        loadAll() {
            Promise.all([
                loadTemplate('allCategories'),
                data.getCategories(),
            ])
                .then(([template, categories]) => {
                    $("#app-container").html(template(categories));
                });
        }
    }
    let catOne = new CategoryController();
    return catOne;
})();

//bookController.js
const bookController = (() => {

    class BookController {
        load(params) {
            let id = +params.id.substr(1);
            Promise.all([
                loadTemplate("books"),
                data.getOneBook(id),
            ])
                .then(([template, book]) => {

                    $("#app-container").html(template(book));
                });
        }
    }
    let bookController = new BookController();
    return bookController;
})();

//aboutController.js
const aboutController = (() => {
    class AboutController {
        load() {
            loadTemplate("about").then(template => {
                $("#app-container").html(template);
            })
        };
    }
    let aboutCtrl = new AboutController();

    return aboutCtrl;
})();

//user.js

class User {
    constructor(username, password) {
        this.username = username;
        this.passHash = password;
        this.books = [];
    }

    get username() {
        return this._username;
    }

    set username(username) {
        // Validations
        validator.isValidString(username);
        validator.isValidUserName(username);

        this._username = username;
    }

    get passHash() {
        return this._passHash;
    }

    set passHash(password) {
        // Validations
        validator.isValidString(password);
        validator.isValidPassword(password);

        // Hash
        this._passHash = CryptoJS.SHA512(password).toString();
    }
}

//notifier.js
const notifier = (() => {

    const MIN_NAME_SYMBOLS = 3,
        MAX_SYMBOLS = 15,
        MIN_PASSWORD_SYMBOLS = 6,
        VALID_SYMBOLS = /^A-Za-z/;

    class Notifier{

        successfullRegistrationMsg(message){
            toastr.success(message, 'Thank you!', { timeOut: 2000 });
        }

        success(message){
            toastr.success(message, {timeOut:1000});
        }

        error(message){
            toastr.error(message, {timeOut: 2000});
        }

        wrongUserNameMsg(){
            toastr.error(`Username must be a string between ${MIN_NAME_SYMBOLS} and ${MAX_SYMBOLS} symbols /
                                 Username can consist only of Capital and small letters`);
        }

        wrongPasswordMsg(){
            toastr.error(`Password must have atleast ${MIN_PASSWORD_SYMBOLS} symbols`);
        }

        info(message){
            toastr.info(message, {timeOut : 2000});
        }
    }

    let notifier = new Notifier();
    return notifier;

})();

//templates.js
function loadTemplate(templateName) {
    const cacheObj = {};

    return new Promise((resolve, reject) => {
        if (cacheObj.hasOwnProperty(templateName)) {

            resolve(cacheObj[templateName]);
        } else {
            $.get(`../templates/${templateName}.handlebars`, templateHtml => {
                var template = Handlebars.compile(templateHtml);
                cacheObj[name] = template;
                resolve(template);
            });

        }
    })
}

//facebook-share-init.js
(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_EN/sdk.js#xfbml=1&version=v2.9";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

//handlebarsExtensions.js
Handlebars.registerHelper("counter", function(index) {
    return index + 1;
});


//main.js
var root = null;
var useHash = true; // Defaults to: false
var hash = '#!'; // Defaults to: '#'

var router = new Navigo(root, useHash, hash);

router.on({
    "home": homeController.load,
    "books/categories/all": categoryController.loadAll,
    "books/category/:name": categoryController.load,
    "books/:id": bookController.load,
    "about": aboutController.load,
    "contacts": contactsController.load,
    "auth": userController.load,
    "signup": userController.signUp,
    "logout": userController.logout,
    "signin": userController.signIn,
    "books/add/:id": userController.addBook,
    "books/remove/:id": userController.removeBook,
    "user/books/all": userController.getMyBooks,
})
    .resolve();

// load the categories before start
homeController.loadCategoryDropDownMenu();

//----------------------- HOW TO FOREACH USERS -----------------
// firebase.database().ref("Library/Users/").once("value").then(snapshot => {
//     snapshot.forEach(u => {
//         console.log(u.val().books);
//     })
// });

window.onload = () => {
    userController.logout();
    location.hash = "#/home";
};

