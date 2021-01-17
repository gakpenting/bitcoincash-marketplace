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
async function getBalance() {
  try {
    // first get BCH balance
    const balance = await bchjs.Electrumx.balance(
      "bchtest:qqqed8mn4f2j6c9kk5ndtexukslsuevkcymat88ajv"
    );

    console.log("BCH Balance information:");
    console.log(JSON.stringify(balance, null, 2));
  } catch (err) {
    console.error("Error in getBalance: ", err);
    throw err;
  }
}
getBalance();
