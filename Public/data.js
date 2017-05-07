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
                    if (!categories.hasOwnProperty(b.category)) {
                        categories[b.category] = {
                            name: b.category,
                            key: i
                        };

                        i++
                        console.log(b.img);
                        resultCategories.push({
                            name: b.category,
                            books: []
                        });
                    }

                    let currentIndex = categories[b.category].key;
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