mocha.setup('bdd');
const { expect, assert } = chai;


describe('Class User tests', () => {
    describe('Constructor tests', () => {

        let user = new User('pesho', '5542255');
        const expectedUsr = 'pesho';
        const expectedPass = CryptoJS.SHA512('5542255').toString();
        const actualUsr = user.username;
        const actulsPass = user.passHash;

        it('constructor should return instance of User', () => {
            chai.expect(user).to.be.an.instanceOf(User);
        });

        it('constructor should set correct username - pesho', () => {

            chai.expect(actualUsr).to.equal(expectedUsr);
        });

        it('constructor should set correct password - 5542255', () => {

            chai.expect(actulsPass).to.equal(expectedPass);
        });
    });

});

describe('Class Validator tests', () => {

    const notifierStubUN = sinon.stub(notifier, 'wrongUserNameMsg');
    const notifierStubPass = sinon.stub(notifier, 'wrongPasswordMsg');

    describe('isValidString test', () => {
        let inValidInput = 454;

        it('Should call notifier if input type is not string', () => {
            validator.isValidString(inValidInput);
            chai.expect(notifierStubUN).to.have.been.called;
        });

        it('Should call notifier if there is no input', () => {
            validator.isValidString('');
            chai.expect(notifierStubUN).to.have.been.called;
        });
    })

    describe('isValidUserName tests', () => {
        const MIN_NAME_SYMBOLS = 3,
            MAX_SYMBOLS = 15,
            VALID_SYMBOLS = /^A-Za-z/;

        it(`Should call notifier if input length is less than ${MIN_NAME_SYMBOLS} symbols`, () => {
            validator.isValidUserName('az');
            chai.expect(notifierStubUN).to.have.been.called;
        });

        it(`Should call notifier if input length is more than ${MAX_SYMBOLS} symbols`, () => {
            validator.isValidUserName('bukvabukvabukvabukva');
            chai.expect(notifierStubUN).to.have.been.called;
        });

        it(`Should call notifier if input symbols does not match  ${VALID_SYMBOLS}`, () => {
            validator.isValidUserName('sdk@ll%');
            chai.expect(notifierStubUN).to.have.been.called;
        });
    });

    describe('isValidPassword tests', () => {

    const MAX_SYMBOLS = 15,
            MIN_PASSWORD_SYMBOLS = 6;

        it(`Should call notifier if password length is less than ${MIN_PASSWORD_SYMBOLS} symbols`, () => {
            validator.isValidPassword('452');
            chai.expect(notifierStubPass).to.have.been.called;
        });

        it(`Should call notifier if password length is more than ${MAX_SYMBOLS} symbols`, () => {
            validator.isValidPassword('12345123451234512345');
            chai.expect(notifierStubPass).to.have.been.called;
        });



    })
});

mocha.run();