/**
 * Created by martinboykov on 6.5.2017 г..
 */
const categoryTwoController = (() => {

    class CategoryTwoController {
       load() {
            loadTemplate("categoryTwo").then(template => {
                $("#app-container").html(template);
            })
        }
    }
    let catTwo = new CategoryTwoController();
    return catTwo;
})();