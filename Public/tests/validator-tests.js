mocha.setup('bdd');
//const { expect, assert } = chai;

describe('Class Validator tests', () => {
    describe('isValidString test', () => {

        const inValidInput = 454;

        it('constructor should return instance of User', () => {
            chai.expect(validator.isValidString).to.throw(('Value must be a string'));
        });

            
    })    
});

mocha.run();