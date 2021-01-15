<template>
  <v-container>
    <v-row justify="space-between">
      <v-col cols="4" class="text-h4 font-weight-bold"
        ><a href="/" style="text-decoration: none; color: black">Home</a></v-col
      >
      <v-col cols="4" class="d-flex justify-end"
        ><v-btn @click="logout">LOGOUT</v-btn></v-col
      >
    </v-row>
    <DashboardInfo
      :disabled="disabled"
      :username="username"
      :profilePhoto="profilePhoto"
      :paypalToken="paypalToken"
      :paypalBalance="paypalBalance"
      @disconnect="disconnectPaypal"
      @connect="connectPaypal"
    />
    <v-row justify="space-between">
      <v-col cols="4" class="text-h4 font-weight-bold"
        >For Sale Repo List</v-col
      >
    </v-row>
    <DashboardForSale
      :disabled="disabled"
      :ownedRepo="false"
      :amountRefresh="amountRefresh"
      @get-all-repo="getAllRepo"
      :listRepo="forSale"
      :paypalToken="paypalToken"
      @sell-repo="sellRepo($event.name, $event.amount)"
      @unlist-repo="unlistRepo($event.repo_id)"
    />
    <v-row justify="space-between">
      <v-col cols="4" class="text-h4 font-weight-bold">Owned Repo</v-col>
    </v-row>
    <DashboardOwned
      :amountRefresh="amountRefresh"
      :disabled="disabled"
      :ownedRepo="true"
      :paypalToken="paypalToken"
      :listRepo="ownedRepo"
    />
    <DashboardRepoAll
      :disabled="disabled"
      @list-repo="listRepo($event.item)"
      @get-all-repo="getAllRepo($event.after_, $event.before_)"
      :pageInfo_="pageInfo_"
      :dialog="dialog"
      :allRepo="allRepo"
    />
    <v-snackbar v-model="snackbarAmount">
      the amount shouldn't be negative or zero
    </v-snackbar>
  </v-container>
</template>

<script lang="ts">
import Cookies from 'js-cookie'
import DashboardInfo from '@/components/dashboard_components/DashboardInfo.vue'
import DashboardForSale from '@/components/dashboard_components/DashboardForSale.vue'
import DashboardOwned from '@/components/dashboard_components/DashboardOwned.vue'
import DashboardRepoAll from '@/components/dashboard_components/DashboardRepoAll.vue'
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import { configs } from '@/utils/configs.js'
@Component({
  components: {
    DashboardInfo,
    DashboardForSale,
    DashboardOwned,
    DashboardRepoAll,
  },
})
export default class MyStore extends Vue {
  @Prop({ required: true }) readonly login!: boolean
  public dialog: boolean = false
  public username: string = ''
  public profilePhoto: string = ''
  public snackbarAmount: boolean = false
  public paypalToken: boolean = false
  public forSale: Array<object> = []
  public allRepo: Array<object> = []
  public ownedRepo: Array<object> = []
  public paypalBalance: number = 0
  public amountRefresh: number = 0
  public disabled: boolean = false
  public pageInfo_: object = {hasPreviousPage:false,hasNextPage:false,startCursor:"",endCursor:""}
  logout() {
    Cookies.remove('token')
    window.location.href = '/'
  }
  async created() {
    // if (!this.login) window.location.href = '/'
    this.disabled = true
    const token = Cookies.get('token')
    const url = configs.get_profile_url
    const forSaleUrl = configs.get_for_sale_url
    const ownedRepoUrl = configs.get_owned_repo_url
    const getPaypalUrl = configs.get_paypal_url
    const profile = await this.$axios.get(`${url}?token=${token}`)
    this.username = profile.data.data.login
    this.profilePhoto = profile.data.data.avatarUrl
    const forSale = await this.$axios.get(`${forSaleUrl}?token=${token}`)
    this.forSale = forSale.data.data
    const ownedRepo = await this.$axios.get(`${ownedRepoUrl}?token=${token}`)
    this.ownedRepo = ownedRepo.data.data
    const paypalToken = await this.$axios.get(`${getPaypalUrl}?token=${token}`)

    if (paypalToken.data.status && !paypalToken.data.data.disconnect) {
      this.paypalToken = true
      this.paypalBalance = paypalToken.data.data.amount
    }
    this.disabled = false
  }
  async getAllRepo(after_: string, before_: string): Promise<void> {
     this.disabled = true
    const token = Cookies.get('token')
    const url = configs.get_all_repo_url

    if (this.allRepo.length === 0) {
      const { data } = await this.$axios.get(`${url}?token=${token}`)
      this.allRepo = data.data.nodes.map(({...other})=>(this.forSale.filter(({repo_id}:any)=>repo_id===other.id).length>0?{added:true,...other}:{...other}))
      console.log(this.allRepo)
      this.pageInfo_ = data.data.pageInfo
    } else if(typeof after_==="string"||typeof before_==="string"){
      const { data } = await this.$axios.get(
        `${url}?token=${token}${before_ ? `&before=${before_}` : ''}${
          after_ ? `&after=${after_}` : ''
        }`
      )
      this.allRepo = data.data.nodes.map(({...other})=>(this.forSale.filter(({repo_id}:any)=>repo_id===other.id).length>0?{added:true,...other}:{...other}))
      this.pageInfo_ = data.data.pageInfo
    }

    this.dialog = true
    this.disabled = false
  }
  async sellRepo(name: string, amount: number) {
    // console.log(amount)
    this.disabled = true
    if (Number(amount) === 0 || Number(amount) < 0 || !amount) {

      this.snackbarAmount = true
      this.disabled = false
      return
    } else {
      const token = Cookies.get('token')
      const url = configs.sell_repo_url

      const { data } = await this.$axios.post(`${url}?token=${token}`, {
        name,
        amount,
      })
      this.amountRefresh = 0
      this.forSale = data.data
    }
    this.disabled = false
  }
  async listRepo(item: object): Promise<void> {
      this.disabled = true
    const token = Cookies.get('token')
    const url = configs.list_repo_url
    const { data } = await this.$axios.post(`${url}?token=${token}`, { item })
    this.forSale = data.data
    this.dialog=false
    this.disabled = false
  }
  async unlistRepo(id: string) {
    this.disabled = true
    const token = Cookies.get('token')
    const url = configs.unlist_repo_url
    const { data } = await this.$axios.post(`${url}?token=${token}`, { id })
    this.forSale = data.data
    this.disabled = false
  }
  async connectPaypal() {
    if (this.username.trim() !== '') {
      window.location.href = `https://www.sandbox.paypal.com/connect/?flowEntry=static&client_id=${configs.paypal_client_id}&response_type=code&scope=email&redirect_uri=${configs.redirect_uri_paypal}`
    } else {
      alert('please wait until username shown')
    }
  }
  async disconnectPaypal() {
    this.disabled = true
    if (this.username.trim() !== '') {
      const url = configs.disconnect_paypal_url
      const token = Cookies.get('token')
     await this.$axios.post(`${url}?token=${token}`)
      this.paypalToken = false
    } else {
      alert('please wait until username shown')
    }
    this.disabled = false
    if (this.forSale.length > 0) {
      this.getforSale()
    }
  }
  async getforSale() {
    this.disabled = true
    const token = Cookies.get('token')
    const url = configs.get_for_sale_url
    const { data } = await this.$axios.get(`${url}?token=${token}`)
    this.forSale = data.data
    this.disabled = false
  }
}
</script>
