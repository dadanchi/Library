const aboutController = (() => {
    class AboutController {
        load() {
            loadTemplate("about").then(template => {
                $("#app-container").html(template);
            })
        };
    }
    let aboutCtrl = new AboutController();

    return aboutCtrl;
})();