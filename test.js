const assert = require('assert');

// Mock window.ethereum for testing
global.window = { ethereum: { request: async () => ['mockAccount'] } };
const ethers = require('ethers');

// Test connect function (adapt from script.js)
async function mockConnect() {
  try {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    assert.strictEqual(accounts[0], 'mockAccount', 'Account mismatch');
    console.log('Connect test passed');
  } catch (error) {
    assert.fail('Connect failed');
  }
}

mockConnect();
