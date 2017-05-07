const notifier = (() => {

    class Notifier{

        successfullRegistrationMsg(message){
            toastr.success(message, 'Thank you!', { timeOut: 2000 });
        }

         error(message){
            toastr.error(message, {timeOut: 2000});
        }

        info(message){
            toastr.info(message, {timeOut : 2000});
        }
    }

    let notifier = new Notifier();
	return notifier;

})();