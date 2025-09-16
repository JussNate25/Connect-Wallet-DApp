const assert = require('assert');
global.window = { ethereum: { request: async () => ['0x1234...5678'] } };
const ethers = require('ethers');
async function testConnect() {
    try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        assert.strictEqual(accounts[0], '0x1234...5678', 'Account mismatch');
        console.log('Connect test passed');
    } catch (error) {
        assert.fail('Connect failed');
    }
}
testConnect();
