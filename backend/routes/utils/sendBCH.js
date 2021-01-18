/*
  Send 1000 satoshis to RECV_ADDR.
*/

// Set NETWORK to either testnet or mainnet
const NETWORK = 'testnet'
// Replace the address below with the address you want to send the BCH to.
let RECV_ADDR = 'bchtest:qqhnglzjevcarux65dx4s7fa6nwe8nha8gfrscm7vt'
// set satoshi amount to send
const SATOSHIS_TO_SEND = 1

// REST API servers.
const BCHN_MAINNET = 'https://bchn.fullstack.cash/v3/'
// const ABC_MAINNET = 'https://abc.fullstack.cash/v3/'
const TESTNET3 = 'https://testnet3.fullstack.cash/v4/'

// bch-js-examples require code from the main bch-js repo
const BCHJS = require('@psf/bch-js')

// Instantiate bch-js based on the network.
let bchjs
if (NETWORK === 'mainnet') bchjs = new BCHJS({ restURL: BCHN_MAINNET })
else bchjs = new BCHJS({ restURL: TESTNET3 })


const SEND_ADDR = "bchtest:qqqed8mn4f2j6c9kk5ndtexukslsuevkcymat88ajv"
const SEND_MNEMONIC = "lemon service gloom marine quarter believe stock drama advance honey mountain another"
async function getFee(address,amount){
  const utxos = await bchjs.Electrumx.utxo(address)
  const utxo = await findBiggestUtxo(utxos.utxos)
  const satoshisToSend =amount
  const originalAmount = utxo?.value
  const byteCount = bchjs.BitcoinCash.getByteCount(
    { P2PKH: 1 },
    { P2PKH: 2 }
  )
  const satoshisPerByte = 1.2
    const txFee = Math.floor(satoshisPerByte * byteCount)
    let remainder = 0;
    if(originalAmount){
      remainder = originalAmount - satoshisToSend - txFee;
    }
    const balance = await getBCHBalance2(address, false)    
        return {txFee,remainder,satoshisToSend,balance}
}
async function sendBch (sender,sender_mnemonic,receiver,amount) {
  try {
    // Get the balance of the sending address.
    const balance = await getBCHBalance(sender, false)
    console.log(`balance: ${JSON.stringify(balance, null, 2)}`)
    console.log(`Balance of sending address ${SEND_ADDR} is ${balance} BCH.`)

    // Exit if the balance is zero.
    if (balance <= 0.0) {
      console.log('Balance of sending address is zero. Exiting.')
      throw new Error('Balance of sending address is zero. Exiting.')
    }

    // If the user fails to specify a reciever address, just send the BCH back
    // to the origination address, so the example doesn't fail.
    if (receiver === '') receiver = sender

    // Convert to a legacy address (needed to build transactions).
    const SEND_ADDR_LEGACY = bchjs.Address.toLegacyAddress(sender)
    const RECV_ADDR_LEGACY = bchjs.Address.toLegacyAddress(receiver)
    console.log(`Sender Legacy Address: ${SEND_ADDR_LEGACY}`)
    console.log(`Receiver Legacy Address: ${RECV_ADDR_LEGACY}`)

    // Get UTXOs held by the address.
    // https://developer.bitcoin.com/mastering-bitcoin-cash/4-transactions/
    const utxos = await bchjs.Electrumx.utxo(sender)
    // console.log(`utxos: ${JSON.stringify(utxos, null, 2)}`);

    if (utxos.utxos.length === 0) throw new Error('No UTXOs found.')

    // console.log(`u: ${JSON.stringify(u, null, 2)}`
    const utxo = await findBiggestUtxo(utxos.utxos)
    // console.log(`utxo: ${JSON.stringify(utxo, null, 2)}`);

    // instance of transaction builder
    let transactionBuilder
    if (NETWORK === 'mainnet') {
      transactionBuilder = new bchjs.TransactionBuilder()
    } else transactionBuilder = new bchjs.TransactionBuilder('testnet')

    // Essential variables of a transaction.
    const satoshisToSend = amount
    const originalAmount = utxo.value
    const vout = utxo.tx_pos
    const txid = utxo.tx_hash

    // add input with txid and index of vout
    transactionBuilder.addInput(txid, vout)

    // get byte count to calculate fee. paying 1.2 sat/byte
    const byteCount = bchjs.BitcoinCash.getByteCount(
      { P2PKH: 1 },
      { P2PKH: 2 }
    )
    console.log(`Transaction byte count: ${byteCount}`)
    const satoshisPerByte = 1.2
    const txFee = Math.floor(satoshisPerByte * byteCount)
    console.log(`Transaction fee: ${txFee}`)

    // amount to send back to the sending address.
    // It's the original amount - 1 sat/byte for tx size
    const remainder = originalAmount - satoshisToSend - txFee

    if (remainder < 0) { throw new Error('Not enough BCH to complete transaction!') }

    // add output w/ address and amount to send
    transactionBuilder.addOutput(receiver, satoshisToSend)
    transactionBuilder.addOutput(sender, remainder)

    // Generate a change address from a Mnemonic of a private key.
    const change = await changeAddrFromMnemonic(sender_mnemonic)

    // Generate a keypair from the change address.
    const keyPair = bchjs.HDNode.toKeyPair(change)

    // Sign the transaction with the HD node.
    let redeemScript
    transactionBuilder.sign(
      0,
      keyPair,
      redeemScript,
      transactionBuilder.hashTypes.SIGHASH_ALL,
      originalAmount
    )

    // build tx
    const tx = transactionBuilder.build()
    // output rawhex
    const hex = tx.toHex()
    // console.log(`TX hex: ${hex}`);
    console.log(' ')

    // Broadcast transation to the network
    const txidStr = await bchjs.RawTransactions.sendRawTransaction([hex])
    // import from util.js file
    const util = require('./util.js')
    console.log(`Transaction ID: ${txidStr}`)
    console.log('Check the status of your transaction on this block explorer:')
    return util.transactionStatus(txidStr, NETWORK)
  } catch (err) {
    throw new Error(err)
    console.log('error: ', err)
  }
}


// Generate a change address from a Mnemonic of a private key.
async function changeAddrFromMnemonic (mnemonic) {
  // root seed buffer
  const rootSeed = await bchjs.Mnemonic.toSeed(mnemonic)

  // master HDNode
  let masterHDNode
  if (NETWORK === 'mainnet') masterHDNode = bchjs.HDNode.fromSeed(rootSeed)
  else masterHDNode = bchjs.HDNode.fromSeed(rootSeed, 'testnet')

  // HDNode of BIP44 account
  const account = bchjs.HDNode.derivePath(masterHDNode, "m/44'/145'/0'")

  // derive the first external change address HDNode which is going to spend utxo
  const change = bchjs.HDNode.derivePath(account, '0/0')

  return change
}

// Get the balance in BCH of a BCH address.
async function getBCHBalance (addr, verbose) {
  try {
    const result = await bchjs.Electrumx.balance(addr)

    if (verbose) console.log(result)

    // The total balance is the sum of the confirmed and unconfirmed balances.
    const satBalance =
      Number(result.balance.confirmed) + Number(result.balance.unconfirmed)

    // Convert the satoshi balance to a BCH balance
    const bchBalance = bchjs.BitcoinCash.toBitcoinCash(satBalance)

    return bchBalance
  } catch (err) {
    console.error('Error in getBCHBalance: ', err)
    console.log(`addr: ${addr}`)
    throw err
  }
}
async function getBCHBalance2 (addr, verbose) {
  try {
    const result = await bchjs.Electrumx.balance(addr)

    if (verbose) console.log(result)

    // The total balance is the sum of the confirmed and unconfirmed balances.
    const satBalance =
      Number(result.balance.confirmed) + Number(result.balance.unconfirmed)

    // Convert the satoshi balance to a BCH balance
    

    return satBalance
  } catch (err) {
    console.error('Error in getBCHBalance: ', err)
    console.log(`addr: ${addr}`)
    throw err
  }
}

// Returns the utxo with the biggest balance from an array of utxos.
async function findBiggestUtxo (utxos) {
  let largestAmount = 0
  let largestIndex = 0

  for (var i = 0; i < utxos.length; i++) {
    const thisUtxo = utxos[i]
    // console.log(`thisUTXO: ${JSON.stringify(thisUtxo, null, 2)}`);

    // Validate the UTXO data with the full node.
    const txout = await bchjs.Blockchain.getTxOut(thisUtxo.tx_hash, thisUtxo.tx_pos)
    if (txout === null) {
      // If the UTXO has already been spent, the full node will respond with null.
      console.log(
        'Stale UTXO found. You may need to wait for the indexer to catch up.'
      )
      continue
    }

    if (thisUtxo.value > largestAmount) {
      largestAmount = thisUtxo.value
      largestIndex = i
    }
  }

  return utxos[largestIndex]
}
module.exports={getFee,sendBch}