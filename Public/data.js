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
    };

    let data = new Data();
    return data;
})();