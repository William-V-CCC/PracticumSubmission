const { ToggleSignal, VALID_HASH } = require('../main');
const crypto = require('crypto');

describe('ToggleSignal', () => {
    test('rejects invalid key', () => {
        const result = ToggleSignal('ON', 'FakeKey');
        expect(result.success).toBe(false);
        expect(result.status).toBe(403);
    });

    test('turns Bat-signal ON with valid key', () => {
        const result = ToggleSignal('ON', 'JimGordan');
        expect(result.success).toBe(true);
        expect(result.message).toMatch(/ON/);
    });

    test('turns Bat-signal OFF with valid key', () => {
        const result = ToggleSignal('OFF', 'JimGordan');
        expect(result.success).toBe(true);
        expect(result.message).toMatch(/OFF/);
    });

    test('hash verification works correctly', () => {
        const hash = crypto.createHash('sha256').update('JimGordan').digest('hex');
        expect(hash).toBe(VALID_HASH);
    });
});
