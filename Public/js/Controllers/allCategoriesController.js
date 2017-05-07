/**
 * Created by martinboykov on 6.5.2017 г..
 */
/*const allCategoriesController = (() => {

    class AllCategoriesController {

       load() {
           loadTemplate("allCategories").then(template => {
               $("#app-container").html(template);
           });
           /!*var database = firebase.database();
           var ref = database.ref('Library/Books');
           ref.on('value',gotData,errData);

           function gotData(data) {
               var books = data.val();
               compile('allCategories', books)
           }
           function errData(err){
               console.log('Error');
               console.log(err);
           }*!/
        }
    }


    let allCategories = new AllCategoriesController();
    return allCategories;
})();*/

const allCategoriesController = (() => {

    class AllCategoriesController {
        load() {
            loadTemplate("allCategories").then(template => {
                $("#app-container").html(template);
            })
        }
    }
    let allCats = new AllCategoriesController();
    return allCats;
})();