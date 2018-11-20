const hash = require('../../utils/hash.js');

describe('sha512', () => {
    it('It should be deterministic', () => {
        const hash1 = hash.sha512('this_is_a_test_pw', 'this_is_a_test_salt');
        const hash2 = hash.sha512('this_is_a_test_pw', 'this_is_a_test_salt');

        expect(hash1).toBe(hash2);
    });
});
