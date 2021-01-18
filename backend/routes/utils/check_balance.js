/*
  Check the balance of the root address of an HD node wallet generated
  with the create-wallet example.
*/

// Set NETWORK to either testnet or mainnet
const NETWORK = "testnet";

// REST API servers.
const BCHN_MAINNET = "https://bchn.fullstack.cash/v4/";
// const ABC_MAINNET = 'https://abc.fullstack.cash/v3/'
const TESTNET3 = "https://testnet3.fullstack.cash/v4/";

// bch-js-examples require code from the main bch-js repo
const BCHJS = require("@psf/bch-js");

// Instantiate bch-js based on the network.
let bchjs;
if (NETWORK === "mainnet") bchjs = new BCHJS({ restURL: BCHN_MAINNET });
else bchjs = new BCHJS({ restURL: TESTNET3 });

// Get the balance of the wallet.
async function getBalance(address) {
  try {
    // first get BCH balance
    const balance = await bchjs.Electrumx.balance(
      address
    );
const satoshi=balance.balance.confirmed+balance.balance.unconfirmed;
    
    return bchjs.BitcoinCash.toBitcoinCash(satoshi);
  } catch (err) {
    console.error("Error in getBalance: ", err);
    throw err;
  }
}
function toBtch(satoshi){
  return bchjs.BitcoinCash.toBitcoinCash(satoshi);
}
module.exports={getBalance,toBtch}
