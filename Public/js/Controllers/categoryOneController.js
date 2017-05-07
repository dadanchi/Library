/**
 * Created by martinboykov on 6.5.2017 г..
 */
const categoryOneController = (() => {

    class CategoryOneController {
       load() {
            loadTemplate("categoryOne").then(template => {
                $("#app-container").html(template);
            })
        }
    }
    let catOne = new CategoryOneController();
    return catOne;
})();