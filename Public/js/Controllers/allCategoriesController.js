const allCategoriesController = (() => {

    class AllCategoriesController {
        load() {
            Promise.all([
                    loadTemplate('allCategories'),
                    data.getCategories(),
                ])
                .then(([template, categories]) => {
                    $("#app-container").html(template(categories));
                });
        }
    }
    let allCats = new AllCategoriesController();
    return allCats;
})();