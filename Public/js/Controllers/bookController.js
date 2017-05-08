const bookController = (() => {

    class BookController {
        load(params) {
            let id = +params.id.substr(1);
            Promise.all([
                    loadTemplate("books"),
                    data.getOneBook(id),
                ])
                .then(([template, book]) => {

                    $("#app-container").html(template(book));
                });
        }
    }
    let bookController = new BookController();
    return bookController;
})();