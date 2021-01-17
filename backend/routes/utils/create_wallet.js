/*
  Create an HDNode wallet using bch-js. The mnemonic from this wallet
  will be used by later examples.
*/

// Set NETWORK to either testnet or mainnet
const NETWORK = "testnet";

// REST API servers.
const BCHN_MAINNET = "https://bchn.fullstack.cash/v3/";
// const ABC_MAINNET = 'https://abc.fullstack.cash/v3/'
const TESTNET3 = "https://testnet3.fullstack.cash/v4/";

// bch-js-examples require code from the main bch-js repo
const BCHJS = require("@psf/bch-js");

// Instantiate bch-js based on the network.
let bchjs;
if (NETWORK === "mainnet") bchjs = new BCHJS({ restURL: BCHN_MAINNET });
else bchjs = new BCHJS({ restURL: TESTNET3 });

const fs = require("fs");

const lang = "english"; // Set the language of the wallet.

// These objects used for writing wallet information out to a file.

const outObj = {};

async function createWallet() {
  try {
    // create 256 bit BIP39 mnemonic
    const mnemonic = bchjs.Mnemonic.generate(
      128,
      bchjs.Mnemonic.wordLists()[lang]
    );
    console.log("BIP44 $BCH Wallet");

    console.log(`128 bit ${lang} BIP39 Mnemonic: `, mnemonic);

    outObj.mnemonic = mnemonic;

    // root seed buffer
    const rootSeed = await bchjs.Mnemonic.toSeed(mnemonic);

    // master HDNode
    let masterHDNode;
    if (NETWORK === "mainnet") masterHDNode = bchjs.HDNode.fromSeed(rootSeed);
    else masterHDNode = bchjs.HDNode.fromSeed(rootSeed, "testnet"); // Testnet

    const childNode = masterHDNode.derivePath(`m/44'/145'/0'/0/0`);

    outObj.cashAddress = bchjs.HDNode.toCashAddress(childNode);
    outObj.legacyAddress = bchjs.HDNode.toLegacyAddress(childNode);
    outObj.WIF = bchjs.HDNode.toWIF(childNode);

    return outObj;
  } catch (err) {
    throw new Error("Error in createWallet(): ", err);
  }
}
module.exports={createWallet};
