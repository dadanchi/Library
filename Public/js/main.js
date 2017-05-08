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
        'signin': userController.signIn,
        'books/add': userController.addBook,
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


window.onload = () => location.hash = "#/home";