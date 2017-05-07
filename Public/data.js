const data = (() => {
    class Data {
        getBooks() {
            return firebase.database().ref("Library/Books").once("value").then(snapshot => {
                return snapshot.val();
            })
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
    };

    let data = new Data();
    return data;
})();