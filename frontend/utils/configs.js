const configs={}
configs.url=process.env.url;
configs.prefix=process.env.prefix;
configs.github_client_id=process.env.github_client_id
configs.paypal_client_id=process.env.paypal_client_id
configs.save_paypal_url=`${configs.url}${configs.prefix}/save-paypal`
configs.buy_paypal_url=`${configs.url}${configs.prefix}/buy-paypal`
configs.for_sale_repo_url=`${configs.url}${configs.prefix}/for-sale-repo`
configs.disconnect_paypal_url=`${configs.url}${configs.prefix}/disconnect-paypal`
configs.redirect_uri_paypal=`${configs.url}${configs.prefix}/paypal-auth`
configs.unlist_repo_url=`${configs.url}${configs.prefix}/unlist-repo`
configs.sell_repo_url=`${configs.url}${configs.prefix}/sell-repo`
configs.get_all_repo_url=`${configs.url}${configs.prefix}/get-all-repo`
configs.get_profile_url=`${configs.url}${configs.prefix}/get-profile`
configs.get_for_sale_url=`${configs.url}${configs.prefix}/get-for-sale-repo`
configs.get_owned_repo_url=`${configs.url}${configs.prefix}/get-owned-repo`
configs.get_paypal_url=`${configs.url}${configs.prefix}/get-paypal`
configs.list_repo_url=`${configs.url}${configs.prefix}/list-repo`
configs.repo_detail_url=`${configs.url}${configs.prefix}/repo-detail`
module.exports={configs}