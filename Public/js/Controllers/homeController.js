const homeController = (() => {
    class HomeController {
        load() {
            return loadTemplate("home").then(template => {
                $("#app-container").html(template);
            })
        };

        loadCategoryDropDownMenu() {
            const $dropDownButton = $(".dropdown-toggle");

            data.getCategories().then(categories =>
                $dropDownButton.on("click", () => {
                    loadTemplate("dropDownCategory")
                        .then((template) => {
                            $dropDownButton.parent().html(template(categories));
                        });
                }));
        }
    }
    let homeController = new HomeController();

    return homeController;
})();