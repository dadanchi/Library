const notifier = (() => {

    const MIN_NAME_SYMBOLS = 3,
        MAX_SYMBOLS = 15,
        MIN_PASSWORD_SYMBOLS = 6,
        VALID_SYMBOLS = /^A-Za-z/;

    class Notifier{

        successfullRegistrationMsg(message){
            toastr.success(message, 'Thank you!', { timeOut: 2000 });
        }

        success(message){
            toastr.success(message, {timeOut:1000});
        }

         error(message){
            toastr.error(message, {timeOut: 2000});
        }

        wrongUserNameMsg(){
            toastr.error(`Username must be a string between ${MIN_NAME_SYMBOLS} and ${MAX_SYMBOLS} symbols /
                                 Username can consist only of Capital and small letters`);
        }

        wrongPasswordMsg(){
            toastr.error(`Password must have atleast ${MIN_PASSWORD_SYMBOLS} symbols`);
        }

        info(message){
            toastr.info(message, {timeOut : 2000});
        }
    }

    let notifier = new Notifier();
	return notifier;

})();