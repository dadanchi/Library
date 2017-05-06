var root = null;
var useHash = true; // Defaults to: false
var hash = '#!'; // Defaults to: '#'



var router = new Navigo(root, useHash, hash);

router.on('home', homeController.load);
router.on('/signup', userController.signUp);










firebase.database().ref("Library/Users/" + 0).once("value").then(snapshot => {
    console.log(snapshot.val().username);
});

const getNextId = (function() {
    let counter = 0;
    return function() {
        counter += 1;
        return counter;
    };
})();