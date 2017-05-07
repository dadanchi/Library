const homeController = (() => {
    class HomeController {
        load() {
            loadTemplate("home").then(template => {
                $("#app-container").html(template);
            })
        };

        loadRegedUserView() {
            loadTemplate("reggedUser").then(template => {
                $("#app-container").html(template);
            });
        }
    }
    let homeController = new HomeController();

    return homeController;
})();