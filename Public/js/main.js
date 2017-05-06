var ref = firebase.database();
var name = "gosho";
var bookId = 1;
ref.ref("Books/" + bookId).set({
    Name: name,
    Author: "Pesho"
});

ref.ref("Books/" + bookId).once("value").then(snapshot => {
    console.log(typeof(snapshot));
    console.log(snapshot.val().Name);
})
