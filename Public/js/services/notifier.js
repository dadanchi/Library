const notifier = (() => {

    class Notifier{

        successfullRegistrationMsg(message){
            toastr.success(message, 'Thank you!', { timeOut: 2000 });
        }
    }

    let notifier = new Notifier();
	return notifier;

})();