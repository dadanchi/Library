
var root = null;
var useHash = true; // Defaults to: false
var hash = '#!'; // Defaults to: '#'

const signUp = function(){

    let dbReference = firebase.database();
    let username = $('#username-input').val();
    let password = $('#password-input').val();
    let userId = getNextId();

    dbReference.ref('Library/Users/' + userId).set({
        password :password,
        username : username
    });

};

var router = new Navigo(root, useHash, hash);

router.on('/signup', signUp);


firebase.database().ref("Library/Users/" + 0).once("value").then(snapshot => {
    console.log(snapshot.val().username);
})



const getNextId = (function () {
		let counter = 0;
		return function () {
			counter += 1;
			return counter;
		};
	})();