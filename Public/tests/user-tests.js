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

mocha.run();