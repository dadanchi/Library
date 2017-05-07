const contactsController = (() => {
    class ContactsController {
        load() {
            loadTemplate("contacts").then(template => {
                $("#app-container").html(template);
            })
        };
    }
    let contactsCtrl = new ContactsController();

    return contactsCtrl;
})();