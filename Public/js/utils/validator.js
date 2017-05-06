const validator = (() => {
    const MIN_NAME_SYMBOLS = 3,
        MAX_SYMBOLS = 15,
        MIN_PASSWORD_SYMBOLS = 6,
        VALID_SYMBOLS = /^A-Za-z/;

    class Validator {
        isValidString(str) {
            if (!str || typeof str !== "string") {
                throw Error("Value must be a string");
            }
            if (str.trim().length === 0) {
                throw Error("Value cannot be full of whitespaces");
            }
        }

        isValidUserName(username) {
            if (username.length < MIN_NAME_SYMBOLS || username.length > MAX_SYMBOLS) {
                throw Error(`Username must be between ${MIN_NAME_SYMBOLS} and ${MAX_SYMBOLS} symbols`);
            }

            if (username.match(VALID_SYMBOLS)) {
                throw Error("Username can consist only of Capital and small letters");
            }
        }

        isValidPassword(password) {
            if (password.length < MIN_PASSWORD_SYMBOLS) {
                throw Error(`Password must have atleast ${MIN_PASSWORD_SYMBOLS} symbols`);
            }

            if (password.length > MAX_SYMBOLS) {
                throw Error(`Password cannot exceed  ${MAX_SYMBOLS} symbols`);
            }
        }

        usernameIsTaken(username) {
            return firebase.database().ref("Library/Users/").once("value").then(snapshot => {
                let result = false;
                snapshot.forEach(u => {
                    if (u.val().username === username) {
                        console.log("here");
                        result = true;
                    }
                });
                console.log("here");
                return result;
            });
        }
    }

    let validator = new Validator();
    return validator;
})();