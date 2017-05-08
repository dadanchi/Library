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

        loadAll() {
            Promise.all([
                    loadTemplate('allCategories'),
                    data.getCategories(),
                ])
                .then(([template, categories]) => {
                    $("#app-container").html(template(categories));
                });
        }
    }
    let catOne = new CategoryController();
    return catOne;
})();