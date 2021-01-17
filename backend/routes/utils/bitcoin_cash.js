"use strict";
const axios = require("axios");
const jwt = require("jsonwebtoken");
const {createWallet}=require("./create_wallet")
const formUrlEncoded = (x) =>
  Object.keys(x).reduce((p, c) => p + `&${c}=${encodeURIComponent(x[c])}`, "");
async function get_profile_db(params, model) {
  const { token, token_pass } = params;
  const { access_token } = jwt.verify(token, token_pass);
  const _user = await model.user.findOne({
    where: { access_token },
    attributes: ["username"],
  });

  if (_user) {
    return {
      _user,
    };
  } else {
    return {};
  }
}
async function add_address(params, model) {
  const { token, token_pass, address, mnemonic } = params;
  const { access_token } = jwt.verify(token, token_pass);
  const _user = await model.user.findOne({
    where: { access_token },
    attributes: ["username"],
  });
  if (!address || !mnemonic) throw new Error("no address or mnemonic");
  if (_user) {
    const [_crypto, created] = await model.crypto_balance.findOrCreate({
      where: { address },
      defaults: {
        username: _user.username,
        mnemonic,
        type: "BCH",
        main: false,
      },
    });
    if (!created) {
      await _crypto.update({ mnemonic, type: "BCH", main: false,username:_user.username });
    }
    const data = await model.crypto_balance.findAll({
      where: { username: _user.username },
    });
    return data;
  } else {
    return [];
  }
}
async function list_address(params, model) {
  const { token, token_pass, address, mnemonic } = params;
  const { access_token } = jwt.verify(token, token_pass);
  const _user = await model.user.findOne({
    where: { access_token },
    attributes: ["username"],
  });
  if (_user) {
    const data = await model.crypto_balance.findAll({
      where: { username: _user.username },
    });
    return data;
  } else {
    return [];
  }
}
async function add_main_address(params, model) {
  const { token, token_pass, address, mnemonic } = params;
  const { access_token } = jwt.verify(token, token_pass);
  const _user = await model.user.findOne({
    where: { access_token },
    attributes: ["username"],
  });
  if (!address) throw new Error("no address");
  if (_user) {
    const _crypto = await model.crypto_balance.findOne({
      where: { address },
    });
    if (_crypto) {
      await model.crypto_balance.update(
        { main: false },
        { where: { username: _user.username } }
      );
      await _crypto.update({ main: true });
    } else {
      throw new Error("address not found");
    }
    const data = await model.crypto_balance.findAll({
      where: { username: _user.username },
    });
    return data;
  } else {
    return [];
  }
}
async function remove_main_address(params, model) {
  const { token, token_pass, address, mnemonic } = params;
  const { access_token } = jwt.verify(token, token_pass);
  const _user = await model.user.findOne({
    where: { access_token },
    attributes: ["username"],
  });
  if (!address) throw new Error("no address");
  if (_user) {
    const _crypto = await model.crypto_balance.findOne({
      where: { address },
    });
    if (_crypto) {
      await model.crypto_balance.update(
        { main: false },
        { where: { username: _user.username } }
      );
    } else {
      throw new Error("address not found");
    }
    const data = await model.crypto_balance.findAll({
      where: { username: _user.username },
    });
    return data;
  } else {
    return [];
  }
}
async function create_new(params, model) {
    const { token, token_pass } = params;
    const { access_token } = jwt.verify(token, token_pass);
    const _user = await model.user.findOne({
      where: { access_token },
      attributes: ["username"],
    });
    
    if (_user) {
        const {mnemonic,cashAddress:address}=await createWallet()
        const [_crypto, created] = await model.crypto_balance.findOrCreate({
            where: { address },
            defaults: {
              username: _user.username,
              mnemonic,
              type: "BCH",
              main: false,
            },
          });
          if (!created) {
            await _crypto.update({ mnemonic, type: "BCH", main: false,username:_user.username });
          }
          const data = await model.crypto_balance.findAll({
            where: { username: _user.username },
          });
          return data;
    } else {
      return [];
    }
  }
module.exports = {
  get_profile_db,
  add_address,
  list_address,
  add_main_address,
  remove_main_address,
  create_new
};
