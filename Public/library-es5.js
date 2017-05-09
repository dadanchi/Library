"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//data.js

var data = function () {
    var Data = function () {
        function Data() {
            _classCallCheck(this, Data);
        }

        _createClass(Data, [{
            key: "getBooks",
            value: function getBooks() {
                return firebase.database().ref("Library/Books").once("value").then(function (snapshot) {
                    var books = snapshot.val();

                    return books;
                });
            }
        }, {
            key: "getOneBook",
            value: function getOneBook(id) {
                return this.getBooks().then(function (books) {
                    for (var i in books) {
                        if (books[i].id === id) {
                            return books[i];
                        }
                    }
                });
            }
        }, {
            key: "getCategories",
            value: function getCategories() {
                var _this = this;

                return this.getBooks().then(function (books) {
                    var categories = [];
                    var resultCategories = [];
                    var i = 0;

                    books.forEach(function (b) {
                        if (!categories.hasOwnProperty(b.category)) {
                            categories[b.category] = {
                                name: b.category,
                                key: i
                            };

                            i++;
                            resultCategories.push({
                                name: b.category,
                                books: []
                            });
                        }

                        var currentIndex = categories[b.category].key;
                        resultCategories[currentIndex].books.push(b);
                    });

                    _this.sortByName(resultCategories);

                    for (var _i in resultCategories) {
                        _this.sortByName(resultCategories[_i].books);
                    }

                    return resultCategories;
                });
            }
        }, {
            key: "getOneCategory",
            value: function getOneCategory(name) {
                return this.getCategories().then(function (categories) {
                    for (var i in categories) {
                        if (categories[i].name === name) {
                            return categories[i];
                        }
                    }
                });
            }
        }, {
            key: "sortByName",
            value: function sortByName(array) {
                return array.sort(function (a, b) {
                    var name1 = a.name.replace(/\s+/g, '').toLowerCase();
                    var name2 = b.name.replace(/\s+/g, '').toLowerCase();

                    if (name1 > name2) {
                        return 1;
                    } else if (name1 > name2) {
                        return -1;
                    }

                    return 0;
                });
            }
        }, {
            key: "createNewUserDataBase",
            value: function createNewUserDataBase(password, username) {
                console.log('dosmth called');
                var btn = $('#user-button');

                var dbReference = firebase.database();
                var userReference = dbReference.ref('Library/Users');
                var newUserReference = userReference.push();

                var key = newUserReference.key;

                newUserReference.set({
                    password: password,
                    username: username,
                    //books: books,
                    key: key
                });
            }
        }, {
            key: "signInUpAct",
            value: function signInUpAct(username) {
                notifier.success("Welcome " + username);
                setTimeout(function () {
                    return homeController.load();
                }, 500);
                $("#auth-btn").addClass("hidden");
                $("#logout-btn").removeClass("hidden");
            }
        }]);

        return Data;
    }();

    ;

    var data = new Data();
    return data;
}();

//validator.js
var validator = function () {
    var MIN_NAME_SYMBOLS = 3,
        MAX_SYMBOLS = 15,
        MIN_PASSWORD_SYMBOLS = 6,
        VALID_SYMBOLS = /^A-Za-z/;

    var Validator = function () {
        function Validator() {
            _classCallCheck(this, Validator);
        }

        _createClass(Validator, [{
            key: "isValidString",
            value: function isValidString(str) {
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
        }, {
            key: "isValidUserName",
            value: function isValidUserName(username) {
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
        }, {
            key: "isValidPassword",
            value: function isValidPassword(password) {
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
        }, {
            key: "usernameIsTaken",
            value: function usernameIsTaken(username) {
                return firebase.database().ref("Library/Users/").once("value").then(function (snapshot) {
                    var result = false;
                    snapshot.forEach(function (u) {
                        if (u.val().username === username) {
                            result = true;
                        }
                    });

                    return result;
                });
            }
        }]);

        return Validator;
    }();

    var validator = new Validator();
    return validator;
}();

//Controllers
//homeController.js

var homeController = function () {
    var HomeController = function () {
        function HomeController() {
            _classCallCheck(this, HomeController);
        }

        _createClass(HomeController, [{
            key: "load",
            value: function load() {
                return loadTemplate("home").then(function (template) {
                    $("#app-container").html(template);
                });
            }
        }, {
            key: "loadCategoryDropDownMenu",
            value: function loadCategoryDropDownMenu() {
                var $dropDownButton = $(".dropdown-toggle");

                data.getCategories().then(function (categories) {
                    return $dropDownButton.on("click", function () {
                        loadTemplate("dropDownCategory").then(function (template) {
                            $dropDownButton.parent().html(template(categories));
                        });
                    });
                });
            }
        }]);

        return HomeController;
    }();

    var homeController = new HomeController();

    return homeController;
}();

//userController.js
var userController = function () {
    var UserController = function () {
        function UserController() {
            _classCallCheck(this, UserController);
        }

        _createClass(UserController, [{
            key: "addBook",
            value: function addBook(params) {
                var id = +params.id.substr(1);
                var user = firebase.auth().currentUser;
                if (user != null) {
                    data.getOneBook(id).then(function (book) {
                        var bookName = book.name;
                        firebase.database().ref("Library/Users").once("value").then(function (snapshot) {
                            snapshot.forEach(function (s) {
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
        }, {
            key: "removeBook",
            value: function removeBook(params) {
                var id = +params.id.substr(1);
                var auth = firebase.auth().currentUser;
                if (auth != null) {
                    var user = void 0;
                    Promise.resolve(firebase.database().ref("Library/Users").once("value").then(function (snapshot) {
                        snapshot.forEach(function (s) {
                            if (s.val().username === auth.displayName) {
                                user = s.val();
                            }
                        });
                        return user;
                    })).then(function (user) {
                        var userBooks = firebase.database().ref("Library/Users/" + user.key + "/Books").once("value").then(function (snapshot) {
                            var isFound = false;
                            snapshot.forEach(function (s) {
                                if (s.val().id === id) {
                                    isFound = true;

                                    // remove the found book
                                    firebase.database().ref("Library/Users/" + user.key + "/Books/" + id).remove().then(function () {
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
        }, {
            key: "getMyBooks",
            value: function getMyBooks() {
                var auth = firebase.auth().currentUser;
                if (auth != null) {
                    var user = void 0;

                    return Promise.resolve(firebase.database().ref("Library/Users").once("value").then(function (users) {
                        users.forEach(function (u) {
                            if (u.val().username === auth.displayName) {
                                user = u.val();
                            }
                        });
                        return user;
                    })).then(function (user) {
                        var userBooks = [];
                        Promise.all([firebase.database().ref("Library/Users/" + user.key + "/Books").once("value").then(function (books) {
                            books.forEach(function (b) {
                                userBooks.push(b.val());
                            });
                            return userBooks;
                        }), loadTemplate("userBooks")]).then(function (_ref) {
                            var _ref2 = _slicedToArray(_ref, 2),
                                books = _ref2[0],
                                template = _ref2[1];

                            $("#app-container").html(template(books));
                        });
                    });
                } else {
                    toastr.error("You need to be logged to add");
                }
            }
        }, {
            key: "load",
            value: function load() {
                loadTemplate("signUp").then(function (template) {
                    $("#app-container").html(template);
                });
            }
        }, {
            key: "signUp",
            value: function signUp() {

                var dbReference = firebase.database();

                var email = $('#email-input').val();

                var username = $('#username-input').val();
                if (!validator.isValidUserName(username) || !validator.isValidString(username)) {
                    $('#username-input').val('');
                    location.hash = '#/auth';
                    return;
                }

                var password = $('#password-input').val();
                if (!validator.isValidPassword(password)) {
                    $('#password-input').val('');
                    location.hash = '#/auth';
                    return;
                }

                var USER_AUTH_KEY = "";
                var newUser = new User(username, password);

                Promise.resolve(validator.usernameIsTaken(username)).then(function (result) {
                    console.log(result);
                    if (!result) {
                        return firebase.auth().createUserWithEmailAndPassword(email, newUser.passHash).then(function (user) {
                            user.updateProfile({
                                displayName: username,
                                isAnonymous: false
                            });

                            data.createNewUserDataBase(newUser.passHash, username);

                            USER_AUTH_KEY = user.uid;

                            localStorage.setItem("username", username);
                            localStorage.setItem("auth-key", USER_AUTH_KEY);

                            data.signInUpAct(username);

                            $(".nav.navbar-nav").append('<li><a href="#/user/books/all" id="my-books">My books</a></li>');
                        }).catch(function (error) {

                            var errorCode = error.code;
                            var errorMessage = error.message;
                            notifier.error(errorCode + ' - ' + errorMessage);
                        });
                    } else {
                        toastr.error("Username is taken");
                    }
                });
            }
        }, {
            key: "logout",
            value: function logout() {
                firebase.auth().signOut().then(function () {
                    localStorage.clear();
                }).catch(function (error) {
                    notifier.error("Problems with signing out");
                    location.hash = "#/auth";
                    return;
                });
                homeController.load().then(function () {
                    $("#auth-btn").removeClass("hidden");
                    $("#logout-btn").addClass("hidden");
                    $("#my-books").remove();
                });
            }
        }, {
            key: "signIn",
            value: function signIn() {
                var email = $('#email-input').val();
                var password = $('#password-input').val();
                var username = $('#username-input').val();
                var auth = firebase.auth();
                var USER_AUTH_KEY = "";

                var newUser = new User(username, password);

                auth.signInWithEmailAndPassword(email, newUser.passHash).then(function (user) {

                    USER_AUTH_KEY = user.uid;

                    localStorage.setItem("username", user.displayName);
                    localStorage.setItem("auth-key", USER_AUTH_KEY);

                    data.signInUpAct(username);

                    $(".nav.navbar-nav").append('<li><a href="#/user/books/all" id="my-books">My books</a></li>');
                }).catch(function () {
                    notifier.error("Wrong email / password / username");
                    location.hash = "#/auth";
                    return;
                });

                auth.onAuthStateChanged(function (user) {
                    if (user) {
                        // add functionality

                    }
                });
            }
        }]);

        return UserController;
    }();

    var usrCntrl = new UserController();
    return usrCntrl;
}();

//contactsController.js
var contactsController = function () {
    var ContactsController = function () {
        function ContactsController() {
            _classCallCheck(this, ContactsController);
        }

        _createClass(ContactsController, [{
            key: "load",
            value: function load() {
                loadTemplate("contacts").then(function (template) {
                    $("#app-container").html(template);
                });
            }
        }]);

        return ContactsController;
    }();

    var contactsCtrl = new ContactsController();

    return contactsCtrl;
}();

//categoryController.js
var categoryController = function () {
    var CategoryController = function () {
        function CategoryController() {
            _classCallCheck(this, CategoryController);
        }

        _createClass(CategoryController, [{
            key: "load",
            value: function load(params) {
                var name = params.name.substr(1);
                Promise.all([loadTemplate("category"), data.getOneCategory(name)]).then(function (_ref3) {
                    var _ref4 = _slicedToArray(_ref3, 2),
                        template = _ref4[0],
                        category = _ref4[1];

                    $("#app-container").html(template(category));
                });
            }
        }, {
            key: "loadAll",
            value: function loadAll() {
                Promise.all([loadTemplate('allCategories'), data.getCategories()]).then(function (_ref5) {
                    var _ref6 = _slicedToArray(_ref5, 2),
                        template = _ref6[0],
                        categories = _ref6[1];

                    $("#app-container").html(template(categories));
                });
            }
        }]);

        return CategoryController;
    }();

    var catOne = new CategoryController();
    return catOne;
}();

//bookController.js
var bookController = function () {
    var BookController = function () {
        function BookController() {
            _classCallCheck(this, BookController);
        }

        _createClass(BookController, [{
            key: "load",
            value: function load(params) {
                var id = +params.id.substr(1);
                Promise.all([loadTemplate("books"), data.getOneBook(id)]).then(function (_ref7) {
                    var _ref8 = _slicedToArray(_ref7, 2),
                        template = _ref8[0],
                        book = _ref8[1];

                    $("#app-container").html(template(book));
                });
            }
        }]);

        return BookController;
    }();

    var bookController = new BookController();
    return bookController;
}();

//aboutController.js
var aboutController = function () {
    var AboutController = function () {
        function AboutController() {
            _classCallCheck(this, AboutController);
        }

        _createClass(AboutController, [{
            key: "load",
            value: function load() {
                loadTemplate("about").then(function (template) {
                    $("#app-container").html(template);
                });
            }
        }]);

        return AboutController;
    }();

    var aboutCtrl = new AboutController();

    return aboutCtrl;
}();

//user.js

var User = function () {
    function User(username, password) {
        _classCallCheck(this, User);

        this.username = username;
        this.passHash = password;
        this.books = [];
    }

    _createClass(User, [{
        key: "username",
        get: function get() {
            return this._username;
        },
        set: function set(username) {
            // Validations
            validator.isValidString(username);
            validator.isValidUserName(username);

            this._username = username;
        }
    }, {
        key: "passHash",
        get: function get() {
            return this._passHash;
        },
        set: function set(password) {
            // Validations
            validator.isValidString(password);
            validator.isValidPassword(password);

            // Hash
            this._passHash = CryptoJS.SHA512(password).toString();
        }
    }]);

    return User;
}();

//notifier.js


var notifier = function () {

    var MIN_NAME_SYMBOLS = 3,
        MAX_SYMBOLS = 15,
        MIN_PASSWORD_SYMBOLS = 6,
        VALID_SYMBOLS = /^A-Za-z/;

    var Notifier = function () {
        function Notifier() {
            _classCallCheck(this, Notifier);
        }

        _createClass(Notifier, [{
            key: "successfullRegistrationMsg",
            value: function successfullRegistrationMsg(message) {
                toastr.success(message, 'Thank you!', { timeOut: 2000 });
            }
        }, {
            key: "success",
            value: function success(message) {
                toastr.success(message, { timeOut: 1000 });
            }
        }, {
            key: "error",
            value: function error(message) {
                toastr.error(message, { timeOut: 2000 });
            }
        }, {
            key: "wrongUserNameMsg",
            value: function wrongUserNameMsg() {
                toastr.error("Username must be a string between " + MIN_NAME_SYMBOLS + " and " + MAX_SYMBOLS + " symbols /\n                                 Username can consist only of Capital and small letters");
            }
        }, {
            key: "wrongPasswordMsg",
            value: function wrongPasswordMsg() {
                toastr.error("Password must have atleast " + MIN_PASSWORD_SYMBOLS + " symbols");
            }
        }, {
            key: "info",
            value: function info(message) {
                toastr.info(message, { timeOut: 2000 });
            }
        }]);

        return Notifier;
    }();

    var notifier = new Notifier();
    return notifier;
}();

//templates.js
function loadTemplate(templateName) {
    var cacheObj = {};

    return new Promise(function (resolve, reject) {
        if (cacheObj.hasOwnProperty(templateName)) {

            resolve(cacheObj[templateName]);
        } else {
            $.get("../templates/" + templateName + ".handlebars", function (templateHtml) {
                var template = Handlebars.compile(templateHtml);
                cacheObj[name] = template;
                resolve(template);
            });
        }
    });
}

//facebook-share-init.js
(function (d, s, id) {
    var js,
        fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s);js.id = id;
    js.src = "//connect.facebook.net/en_EN/sdk.js#xfbml=1&version=v2.9";
    fjs.parentNode.insertBefore(js, fjs);
})(document, 'script', 'facebook-jssdk');

//handlebarsExtensions.js
Handlebars.registerHelper("counter", function (index) {
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
    "user/books/all": userController.getMyBooks
}).resolve();

// load the categories before start
homeController.loadCategoryDropDownMenu();

//----------------------- HOW TO FOREACH USERS -----------------
// firebase.database().ref("Library/Users/").once("value").then(snapshot => {
//     snapshot.forEach(u => {
//         console.log(u.val().books);
//     })
// });

window.onload = function () {
    userController.logout();
    location.hash = "#/home";
};
