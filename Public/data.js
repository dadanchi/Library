const data = (() => {
    class Data {
        getBooks() {
            return firebase.database().ref("Library/Books").once("value").then(snapshot => {
                return snapshot.val();
            })
        }

        getCategories() {
            return this.getBooks().then(books => {
                let categories = [];
                let resultCategories = [];
                let i = 0;

                books.forEach(b => {
                    if (!categories.hasOwnProperty(b.genre)) {
                        categories[b.genre] = {
                            name: b.genre,
                            key: i
                        };

                        i++

                        resultCategories.push({
                            name: b.genre,
                            books: []
                        });
                    }

                    let currentIndex = categories[b.genre].key;
                    resultCategories[currentIndex].books.push(b);
                });

                console.log(resultCategories);
                return resultCategories;
            });
        }
    };

    let data = new Data();
    return data;
})();