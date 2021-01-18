<template>
  <v-row justify="center" align="center">
    <Buy v-if="!transaction_finish" :item="item" :repo_id="item.repo_id" :balance="balance" :satoshiToSend="satoshiToSend" :txFee="txFee" :remainder="remainder" :disabled="disabled" @buy-now="buyNow" @buy="buy" :dialog="dialog" :gone="gone" :username="username_"/>
    <Transaction v-if="transaction_finish" :transaction_url="transaction_url" :github_url="github_url"/>
  </v-row>
</template>
<script lang="ts">
import Cookies from 'js-cookie'
import Buy from '@/components/Buy.vue'
import Transaction from '@/components/Transaction.vue'
import { Component, Vue } from 'nuxt-property-decorator'
import axios from 'axios'
import { configs } from '@/utils/configs.js'
@Component({
  components: {
    Buy,
    Transaction
  },
})
export default class MyStore extends Vue {
  public disabled: boolean = false
  public username_: string = ''
  public item: object = {}
  public balance: number = 0
  public satoshiToSend: number = 0
  public txFee: number = 0
  public remainder: number = 0
  public dialog:boolean=false;
  public gone:boolean=false;
  public transaction_finish:boolean=false
  public transaction_url:string=""
  public github_url:string=""
  async mounted() {
    this.disabled=true
    Cookies.remove('redirect')
    const username = this.$route.query.username
    const name = this.$route.query.name
    const url = configs.repo_detail_url
    const { data } = await axios.post(`${url}`, { username, name })
    this.item = data
    const token = Cookies.get('token')
    try {
      const { data: feeDetail } = await axios.post(
        `${configs.url}/get-fee${token ? '?token=' + token : ''}`,
        { id: data.repo_id }
      )
      this.balance = feeDetail.balance
      this.satoshiToSend = feeDetail.satoshisToSend
      this.txFee = feeDetail.txFee
      this.remainder = feeDetail.remainder
    } catch (e) {}

    if (Cookies.get('token')) {
      const token = Cookies.get('token')
      const _url = configs.get_profile_url
      const profile = await this.$axios.get(`${_url}?token=${token}`)
      this.username_ = profile.data.data.login
    }
        this.disabled=false
  }

  buyNow(){
    const token = Cookies.get('token')
    if(!token||token.trim()==='') window.location.href="/login"
this.dialog=true
  }

  async buy(){
this.gone=true
const token = Cookies.get('token')
try{
  const {data} = await this.$axios.post(`${configs.url}/buy-repo?token=${token}`,{id:this.item})
if(data.status){
  this.transaction_url=data.transaction_url
  this.github_url=data.github_url
  this.transaction_finish=true
  this.dialog=false
  this.gone=false
}else{
  this.transaction_url=""
  this.github_url=""
   this.transaction_finish=false
this.dialog=false
  this.gone=false
}
}catch(e){
  this.transaction_url=""
  this.github_url=""
   this.transaction_finish=false
this.dialog=false
  this.gone=false
}

  }
}
</script>

