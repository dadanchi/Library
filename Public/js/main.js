var root = null;
var useHash = true; // Defaults to: false
var hash = '#!'; // Defaults to: '#'

var router = new Navigo(root, useHash, hash);

router.on({
    "home": homeController.load,
    "auth": userController.load,
    '/signup': userController.signUp,
})
.resolve();


// firebase.database().ref("Library/Users/" + 0).once("value").then(snapshot => {
//     console.log(snapshot.val().username);
// });



window.onload = () => location.hash = "/home";