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

                    console.log($(".add-book-btn").html());
                    $(".add-book-btn").on("click", book => {
                        userController.addBook();

                    });
                });
        }
    }
    let bookController = new BookController();
    return bookController;
})();