"use strict";
const axios = require("axios");
const jwt = require("jsonwebtoken");
const {createWallet}=require("./create_wallet")
const {getBalance,toBtch}=require("./check_balance")
const {sellRepo}=require("./sell_repo");
const { getFee,sendBch } = require("./sendBCH");
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
      await model.for_sell.update(
        { sell: "UNLIST" },
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
  async function get_main_address(params, model) {
    const { token, token_pass} = params;
    const { access_token } = jwt.verify(token, token_pass);
    const _user = await model.user.findOne({
      where: { access_token },
      attributes: ["username"],
    });
    
    if (_user) {
      const _crypto = await model.crypto_balance.findOne({
        where: { main:true,username:_user.username },
      });
      if (_crypto) {
        return _crypto;
      } else {
      return _crypto
      }
      
    } else {
      return null;
    }
  }
  async function get_balance(params, model) {
    const { token, token_pass} = params;
    const { access_token } = jwt.verify(token, token_pass);
    const _user = await model.user.findOne({
      where: { access_token },
      attributes: ["username"],
    });
    
    if (_user) {
      const _crypto = await model.crypto_balance.findOne({
        where: { main:true,username:_user.username },
      });
      if (_crypto) {
        const balance=await getBalance(_crypto.address);
        return balance;
      } else {
      return 0
      }
      
    } else {
      return null;
    }
  }
  async function sell_repo_btch(params, model) {
    const { token, token_pass,name,amount} = params;
    const { access_token } = jwt.verify(token, token_pass);
    const _user = await model.user.findOne({
      where: { access_token },
      attributes: ["username"],
    });
    
    if (_user) {
      const sell=sellRepo({ token, token_pass,name,amount,model})
      if (sell&&sell.status!==false) {
        return sell;
      } else {
      return []
      }
      
    } else {
      return null;
    }
  }
 function convert_to_btch(amount){
  
return toBtch(amount)
  }
  async function get_fee(params,model){
    const {token, token_pass,id}=params;
    const { access_token } = jwt.verify(token, token_pass);
    const _user = await model.user.findOne({
      where: { access_token },
      attributes: ["username"],
    });
    if(_user){
      const {amount}=await model.for_sell.findOne({where:{repo_id:id}})
      const {address}=await model.crypto_balance.findOne({where:{username:_user.username,main:true}})
      return getFee(address,amount);
    }else{
      return null
    }
    
  }
  const buy_repo = async function (params,model) {
    const { token,id } = params;
    const { access_token } = jwt.verify(token, params.token_pass);
    const res=await model.user.findOne({where:{access_token}})
    if (res) {
           
  const privateRepo=await model.for_sell.findOne({where:{repo_id:id}})
  const sender=await model.crypto_balance.findOne({where:{username:res.username,main:true}})
        const repoOwner=await model.user.findOne({where:{username:privateRepo.username }})
      const receiver=await model.crypto_balance.findOne({where:{username:privateRepo.username,main:true}})  
      const transaction_url=await sendBch(sender.address,sender.mnemonic,receiver.address,privateRepo.amount) 
      const deleted = await axios({
        url: `https://api.github.com/repos/${privateRepo.username}/${privateRepo.name}/collaborators/${res.username}`,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `bearer ${repoOwner.access_token}`,
        },
        method: "DELETE",
      });
      const { data, status } = await axios({
        url: `https://api.github.com/repos/${privateRepo.username}/${privateRepo.name}/collaborators/${res.username}`,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `bearer ${repoOwner.access_token}`,
        },
        data: {
          permission: "admin",
        },
        method: "PUT",
      });
     
      if (status === 201) {
        
        const {  username,repo_id, description,name,openGraphImageUrl,url,sell,amount:_amount } = privateRepo;
        const [owned,created]=await model.owned_repo.findOrCreate({where:{repo_id},defaults:{
          description,name,openGraphImageUrl,url,sell,amount:_amount,
          owner_username: username,
          username: res.username
        }})
       await owned.update({
        description,name,openGraphImageUrl,url,sell,amount:_amount,
        owner_username: username,
        username: res.username})
        
        if (created||owned) {
          return {
            transaction_url,
            github_url:data.html_url ,
            status: true,
          };
          
        } else {
          return {
            message:"error repo not owned",
            status: false,
          };
        
        }
      } else {
        
        return {
          message:"error username not found",
          status:false,
        };
      }
    }
  };
module.exports = {
  get_profile_db,
  add_address,
  list_address,
  add_main_address,
  remove_main_address,
  create_new,
  get_main_address,
  get_balance,
  sell_repo_btch,
  convert_to_btch,
  get_fee,
  buy_repo
};
