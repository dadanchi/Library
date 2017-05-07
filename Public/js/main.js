var root = null;
var useHash = true; // Defaults to: false
var hash = '#!'; // Defaults to: '#'

var router = new Navigo(root, useHash, hash);

router.on({
        "home": homeController.load,
        "books/allCategories": allCategoriesController.load,
        "books/Category#1": categoryOneController.load,
        "books/Category#2": categoryTwoController.load,
        "books/Category#3": categoryThreeController.load,
        "auth": userController.load,
        "signup": userController.signUp,
        "logout": userController.logout,
    })
    .resolve();


//----------------------- HOW TO FOREACH USERS -----------------
// firebase.database().ref("Library/Users/").once("value").then(snapshot => {
//     snapshot.forEach(u => {
//         console.log(u.val().books);
//     })
// });




window.onload = () => location.hash = "/home";