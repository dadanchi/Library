class User {
    constructor(username, password) {
        this.username = username;
        this.passHash = password;
        this.books = [];
    }

    get username() {
        return this._username;
    }

    set username(username) {
        // Validations
        validator.isValidString(username);
        validator.isValidUserName(username);

        this._username = username;
    }

    get passHash() {
        return this._passHash;
    }

    set passHash(password) {
        // Validations
        validator.isValidString(password);
        validator.isValidPassword(password);

        // Hash
        this._passHash = CryptoJS.SHA512(password).toString();
    }
}