const categoryController = (() => {

    class CategoryController {
        load(params) {
            let name = params.name.substr(1);

            Promise.all([
                    loadTemplate("category"),
                    data.getOneCategory(name),
                ])
                .then(([template, category]) => {
                    $("#app-container").html(template(category));
                })
        }
    }
    let catOne = new CategoryController();
    return catOne;
})();