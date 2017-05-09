const validator = (() => {
    const MIN_NAME_SYMBOLS = 3,
        MAX_SYMBOLS = 15,
        MIN_PASSWORD_SYMBOLS = 6,
        VALID_SYMBOLS = /^A-Za-z/;

    class Validator {
        isValidString(str) {
            if (!str || typeof str !== "string") {
                notifier.wrongUserNameMsg();
                return false;
            }
            if (str.trim().length === 0) {
                notifier.wrongUserNameMsg();
                return false;
            }
            return true;
        }

        isValidUserName(username) {
            if (username.length < MIN_NAME_SYMBOLS || username.length > MAX_SYMBOLS) {
                notifier.wrongUserNameMsg();
                return false;
            }
            if (username.match(VALID_SYMBOLS)) {
                notifier.wrongUserNameMsg();
                return false;
            }

            return true;
        }

        isValidPassword(password) {
            if (password.length < MIN_PASSWORD_SYMBOLS) {
                notifier.wrongPasswordMsg();
                return false;
            }

            if (password.length > MAX_SYMBOLS) {
                notifier.wrongPasswordMsg();
                return false;
            }
            return true;
        }

        usernameIsTaken(username) {
            return firebase.database().ref("Library/Users/").once("value").then(snapshot => {
                let result = false;
                snapshot.forEach(u => {
                    if (u.val().username === username) {
                        result = true;
                    }
                });

                return result;
            });
        }
    }

    let validator = new Validator();
    return validator;
})();