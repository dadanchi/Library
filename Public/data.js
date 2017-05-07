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

                books.forEach(b => {
                    if (!categories.hasOwnProperty(b.genre)) {
                        categories[b.genre] = { name: b.genre };
                        resultCategories.push({ name: b.genre });
                    }
                });

                return resultCategories;
            });
        }
    };

    let data = new Data();
    return data;
})();