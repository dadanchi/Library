/**
 * Created by martinboykov on 6.5.2017 г..
 */
const categoryThreeController = (() => {

    class CategoryThreeController  {
       load() {
            loadTemplate("categoryThree").then(template => {
                $("#app-container").html(template);
            })
        }
    }
    let catThree = new CategoryThreeController();
    return catThree;
})();